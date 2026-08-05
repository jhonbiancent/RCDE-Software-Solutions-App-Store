import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_SCREENSHOTS = 6;

export async function POST(req: Request) {
  const session = await auth();
  if (!(session?.user as { isAdmin?: boolean } | undefined)?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_SCREENSHOTS_BUCKET;

  if (!supabaseUrl || !serviceKey || !bucket) {
    return new NextResponse("Supabase storage is not configured", { status: 500 });
  }

  const formData = await req.formData();
  const screenshots = formData
    .getAll("screenshots")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (screenshots.length > MAX_SCREENSHOTS) {
    return new NextResponse(`Upload up to ${MAX_SCREENSHOTS} screenshots`, { status: 400 });
  }

  async function save(file: File) {
    if (!file.type.startsWith("image/")) throw new Error("Only images are allowed");

    const ext = path.extname(file.name) || ".png";
    const objectPath = `screenshots/${crypto.randomUUID()}${ext}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`;
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: Buffer.from(await file.arrayBuffer()),
    });

    if (!res.ok) throw new Error("Upload failed");
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
  }

  try {
    return NextResponse.json({
      screenshotUrls: await Promise.all(screenshots.map(save)),
    });
  } catch {
    return new NextResponse("Invalid upload", { status: 400 });
  }
}
