import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!(session?.user as any)?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const json = await req.json();
    const screenshots =
      json.screenshots === undefined
        ? undefined
        : typeof json.screenshots === "string"
          ? json.screenshots.split(/\r?\n/).map((url: string) => url.trim()).filter(Boolean)
          : json.screenshots;

    if (screenshots && screenshots.length > 6) {
      return new NextResponse("Maximum 6 screenshots allowed", { status: 400 });
    }

    const platforms = Array.isArray(json.platforms) ? json.platforms : [];
    const categories = Array.isArray(json.categories) ? json.categories : [];
    
    const app = await prisma.app.update({
      where: { id },
      data: {
        name: json.name,
        slug: json.slug,
        tagline: json.tagline,
        description: json.description,
        platforms,
        categories,
        techStack: json.techStack ? (typeof json.techStack === 'string' ? json.techStack.split(",").map((t: string) => t.trim()) : json.techStack) : [],
        liveUrl: json.liveUrl || null,
        downloadUrl: json.downloadUrl || null,
        iconUrl: json.iconUrl || null,
        ...(screenshots ? { screenshots } : {}),
        status: json.status,
        featured: json.featured,
      },
    });

    return NextResponse.json(app);
  } catch (error) {
    console.error("[APPS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!(session?.user as any)?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.app.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[APPS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
