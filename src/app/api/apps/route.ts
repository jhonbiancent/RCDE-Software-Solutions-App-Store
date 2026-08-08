import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!(session?.user as any)?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const json = await req.json();
    const screenshots = json.screenshots
      ? json.screenshots.split(/\r?\n/).map((url: string) => url.trim()).filter(Boolean)
      : [];
    const platforms = Array.isArray(json.platforms) ? json.platforms : [];
    const categories = Array.isArray(json.categories) ? json.categories : [];

    if (screenshots.length > 6) {
      return new NextResponse("Maximum 6 screenshots allowed", { status: 400 });
    }

    // In a real app, use Zod to validate `json`
    const app = await prisma.app.create({
      data: {
        name: json.name,
        slug: json.slug,
        tagline: json.tagline,
        description: json.description,
        platforms,
        categories,
        techStack: json.techStack ? json.techStack.split(",").map((t: string) => t.trim()) : [],
        liveUrl: json.liveUrl || null,
        downloadUrl: json.downloadUrl || null,
        iconUrl: json.iconUrl || null,
        screenshots,
        status: json.status || "DRAFT",
        featured: json.featured || false,
      },
    });

    return NextResponse.json(app);
  } catch (error) {
    console.error("[APPS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
