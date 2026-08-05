import Link from "next/link";
import { AppWindow, Star } from "lucide-react";
import { AppWithRating } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function AppCard({ app }: { app: AppWithRating }) {
  return (
    <Link href={`/apps/${app.slug}`}>
      <Card className="h-full cursor-pointer overflow-hidden bg-white transition-all hover:border-primary/50 hover:shadow-md flex flex-col">
        <CardHeader>
          <div className="mb-3 flex size-14 items-center justify-center rounded-xl border bg-muted text-muted-foreground">
            <AppWindow className="size-6" aria-hidden="true" />
          </div>
          <CardTitle className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate">{app.name}</span>
            {app.averageRating ? (
              <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-yellow-500">
                <Star className="size-4 fill-current" aria-hidden="true" />
                {app.averageRating.toFixed(1)}
              </span>
            ) : null}
          </CardTitle>
          <CardDescription className="line-clamp-2">{app.tagline || app.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{app.category.replace("_", " ")}</Badge>
            {app.techStack.slice(0, 3).map((tech: string) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <span>{app.viewCount} views</span>
          {app._count?.reviews ? <span>{app._count.reviews} reviews</span> : null}
        </CardFooter>
      </Card>
    </Link>
  );
}
