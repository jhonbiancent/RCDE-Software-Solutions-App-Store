import { Button } from "@/components/ui/button";
import { AppGrid } from "@/components/app-grid";
import { prisma } from "@/lib/prisma";
import { AppWithRating } from "@/types";
import { ArrowRight, Grid3X3, UserRound } from "lucide-react";

export const revalidate = 60;

export default async function Home() {
  const apps = await prisma.app.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reviews: true } } },
  });

  const appsWithRatings = await Promise.all(
    apps.map(async (app) => {
      const avg = await prisma.review.aggregate({
        where: { appId: app.id },
        _avg: { rating: true },
      });
      return { ...app, averageRating: avg._avg.rating || null } as AppWithRating;
    })
  );

  return (
    <div className="flex min-h-screen flex-col bg-white px-20">
      <section className="w-full border-b bg-white py-16 md:py-24 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Personal app store and portfolio
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                AppShelf
              </h1>
              <p className="mx-auto max-w-175 text-muted-foreground md:text-xl">
                A personal portfolio and app store showcasing web apps, desktop software, and websites I&apos;ve built.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/apps" size="lg">
                <Grid3X3 className="size-4" aria-hidden="true" />
                Browse Apps
              </Button>
              <Button href="/about" variant="outline" size="lg">
                <UserRound className="size-4" aria-hidden="true" />
                About Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 md:py-16">
        <div className="container px-4 md:px-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Apps</h2>
              <p className="max-w-180 text-muted-foreground">
                Browse the software, tools, and websites currently published in the store.
              </p>
            </div>
            <Button href="/apps" variant="secondary">
              View full apps page
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="mx-auto max-w-6xl">
            <AppGrid apps={appsWithRatings} />
          </div>
        </div>
      </section>
    </div>
  );
}
