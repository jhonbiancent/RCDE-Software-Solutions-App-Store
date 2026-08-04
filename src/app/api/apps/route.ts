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
    // In a real app, use Zod to validate `json`
    const app = await prisma.app.create({
      data: {
        name: json.name,
        slug: json.slug,
        tagline: json.tagline,
        description: json.description,
        caseStudy: json.caseStudy,
        category: json.category,
        techStack: json.techStack ? json.techStack.split(",").map((t: string) => t.trim()) : [],
        githubOwner: json.githubOwner || null,
        githubRepo: json.githubRepo || null,
        liveUrl: json.liveUrl || null,
        coverImage: json.coverImage || null,
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
