import { prisma } from "@/lib/prisma";
import { AppGrid } from "@/components/app-grid";
import { AppWithRating } from "@/types";

export const revalidate = 60; // ISR

export default async function AppsPage() {
  const apps = await prisma.app.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { reviews: true }
      }
    }
  });

  // Calculate average rating for each app (Prisma doesn't easily do this in a single query across relations in SQLite/Postgres without complex aggregates)
  const appsWithRatings = await Promise.all(
    apps.map(async (app) => {
      const avg = await prisma.review.aggregate({
        where: { appId: app.id },
        _avg: { rating: true }
      });
      return {
        ...app,
        averageRating: avg._avg.rating || null
      } as AppWithRating;
    })
  );

  return (
    <div className="container py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">All Apps & Projects</h1>
        <p className="text-xl text-muted-foreground">Browse all the software, tools, and websites I've built.</p>
      </div>
      <AppGrid apps={appsWithRatings} />
    </div>
  );
}
