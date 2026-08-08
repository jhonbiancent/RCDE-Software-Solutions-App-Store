import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { DownloadButton } from "@/components/download-button";
import { MediaGallery } from "@/components/media-gallery";
import { AppWindow } from "lucide-react";

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

  // Increment view count (fire-and-forget, non-blocking)
  prisma.app.update({ where: { id: app.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border shrink-0 overflow-hidden">
          {app.iconUrl ? (
            <img src={app.iconUrl} alt={`${app.name} icon`} className="h-full w-full object-cover" />
          ) : (
            <AppWindow className="size-10" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">{app.name}</h1>
          <p className="text-lg text-muted-foreground">{app.tagline}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {app.platforms.map((platform) => (
              <Badge key={platform} variant="secondary">{platform}</Badge>
            ))}
            {app.categories.map((category) => (
              <Badge key={category} variant="outline">{category}</Badge>
            ))}
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
          liveUrl={app.liveUrl}
          downloadUrl={app.downloadUrl}
        />
      </div>

      {/* Media Gallery */}
      <MediaGallery screenshots={app.screenshots} />

      {/* Description */}
      <div className="space-y-3 border-t pt-10">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{app.description}</p>
      </div>
    </div>
  );
}
