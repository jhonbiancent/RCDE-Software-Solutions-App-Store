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
    
    const app = await prisma.app.update({
      where: { id },
      data: {
        name: json.name,
        slug: json.slug,
        tagline: json.tagline,
        description: json.description,
        caseStudy: json.caseStudy,
        category: json.category,
        techStack: json.techStack ? (typeof json.techStack === 'string' ? json.techStack.split(",").map((t: string) => t.trim()) : json.techStack) : [],
        githubOwner: json.githubOwner || null,
        githubRepo: json.githubRepo || null,
        liveUrl: json.liveUrl || null,
        coverImage: json.coverImage || null,
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
