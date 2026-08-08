import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_SCREENSHOTS = 6;

function storageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_SCREENSHOTS_BUCKET;

  if (!supabaseUrl || !serviceKey || !bucket) return null;
  return { supabaseUrl, serviceKey, bucket };
}

function objectPathFromPublicUrl(url: string, bucket: string) {
  try {
    const marker = `/storage/v1/object/public/${bucket}/`;
    return new URL(url).pathname.split(marker)[1];
  } catch {
    return null;
  }
}

async function deleteObjects(urls: string[], config: NonNullable<ReturnType<typeof storageConfig>>) {
  const prefixes = urls.map((url) => objectPathFromPublicUrl(url, config.bucket)).filter(Boolean);
  if (!prefixes.length) return;

  await fetch(`${config.supabaseUrl}/storage/v1/object/${config.bucket}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes }),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!(session?.user as { isAdmin?: boolean } | undefined)?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const config = storageConfig();
  if (!config) {
    return new NextResponse("Supabase storage is not configured", { status: 500 });
  }
  const storage = config;
  const { supabaseUrl, serviceKey, bucket } = storage;

  const formData = await req.formData();
  const slug = String(formData.get("slug") || "app")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "app";
  const icon = formData.get("icon");
  const deleteUrls = formData.getAll("deleteUrls").map(String).filter(Boolean);
  const screenshots = formData
    .getAll("screenshots")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (screenshots.length > MAX_SCREENSHOTS) {
    return new NextResponse(`Upload up to ${MAX_SCREENSHOTS} screenshots`, { status: 400 });
  }

  async function removeOldFiles() {
    await deleteObjects(deleteUrls, storage);
  }

  async function save(file: File, folder: "icons" | "screenshots") {
    if (!file.type.startsWith("image/")) throw new Error("Only images are allowed");

    const ext = path.extname(file.name) || ".png";
    const objectPath = `apps/${slug}/${folder}/${crypto.randomUUID()}${ext}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}?cacheControl=31536000`;
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: Buffer.from(await file.arrayBuffer()),
    });

    if (!res.ok) throw new Error(await res.text());
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
  }

  try {
    await removeOldFiles();

    return NextResponse.json({
      iconUrl: icon instanceof File && icon.size ? await save(icon, "icons") : null,
      screenshotUrls: await Promise.all(screenshots.map((file) => save(file, "screenshots"))),
    });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "Invalid upload", { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!(session?.user as { isAdmin?: boolean } | undefined)?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const config = storageConfig();
  if (!config) {
    return new NextResponse("Supabase storage is not configured", { status: 500 });
  }

  const { urls } = await req.json();
  await deleteObjects(Array.isArray(urls) ? urls : [], config);
  return new NextResponse(null, { status: 204 });
}
