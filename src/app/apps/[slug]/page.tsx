import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { fetchLatestRelease } from "@/lib/github";
import { Badge } from "@/components/ui/badge";
import { DownloadButton } from "@/components/download-button";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });
  if (!app) return {};
  return {
    title: `${app.name} — AppShelf`,
    description: app.tagline || app.description.slice(0, 160),
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const app = await prisma.app.findUnique({
    where: { slug },
    include: { _count: { select: { reviews: true } } },
  });

  if (!app || app.status !== "PUBLISHED") {
    notFound();
  }

  // Fetch GitHub release if configured (cached 5 min by Next.js fetch)
  const release =
    app.githubOwner && app.githubRepo
      ? await fetchLatestRelease(app.githubOwner, app.githubRepo)
      : null;

  const repoUrl =
    app.githubOwner && app.githubRepo
      ? `https://github.com/${app.githubOwner}/${app.githubRepo}`
      : null;

  // Increment view count (fire-and-forget, non-blocking)
  prisma.app.update({ where: { id: app.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  return (
    <div className="container py-10 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {app.coverImage ? (
          <img
            src={app.coverImage}
            alt={app.name}
            className="w-24 h-24 rounded-2xl object-cover border shadow-sm shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground border shrink-0">
            {app.name[0]}
          </div>
        )}

        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">{app.name}</h1>
          <p className="text-lg text-muted-foreground">{app.tagline}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">{app.category.replace(/_/g, " ")}</Badge>
            {app.techStack.map((tech) => (
              <Badge key={tech} variant="outline">{tech}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-1">{app.viewCount.toLocaleString()} views</p>
        </div>
      </div>

      {/* Download / Visit */}
      <div className="border rounded-xl p-6 bg-muted/30">
        <DownloadButton
          assets={release?.assets}
          repoUrl={repoUrl}
          liveUrl={app.liveUrl}
          tagName={release?.tag_name}
        />
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{app.description}</p>
      </div>

      {/* Case Study */}
      {app.caseStudy && (
        <div className="space-y-3 border-t pt-10">
          <h2 className="text-2xl font-bold">Case Study</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{app.caseStudy}</p>
          </div>
        </div>
      )}
    </div>
  );
}
