import { Button } from "@/components/ui/button";
import { AppGrid } from "@/components/app-grid";
import { prisma } from "@/lib/prisma";
import { AppWithRating } from "@/types";

export const revalidate = 60;

export default async function Home() {
  const featuredApps = await prisma.app.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { _count: { select: { reviews: true } } },
  });

  const appsWithRatings = await Promise.all(
    featuredApps.map(async (app) => {
      const avg = await prisma.review.aggregate({
        where: { appId: app.id },
        _avg: { rating: true },
      });
      return { ...app, averageRating: avg._avg.rating || null } as AppWithRating;
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                Welcome to AppShelf
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A personal portfolio and app store showcasing web apps, desktop software, and websites I've built.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              <Button href="/apps" size="lg">Browse All Apps</Button>
              <Button href="/about" variant="outline" size="lg">About Me</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apps */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Projects</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Check out some of my best work below.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-5xl">
            <AppGrid apps={appsWithRatings} />
          </div>
          <div className="flex justify-center mt-12">
            <Button href="/apps" variant="secondary">View All →</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
