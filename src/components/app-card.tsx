import Link from "next/link";
import { AppWithRating } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function AppCard({ app }: { app: AppWithRating }) {
  return (
    <Link href={`/apps/${app.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:border-primary/50 flex flex-col cursor-pointer">
        {app.coverImage ? (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img src={app.coverImage} alt={app.name} className="object-cover w-full h-full" />
          </div>
        ) : (
          <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{app.name}</span>
            {app.averageRating ? (
              <span className="text-sm font-medium flex items-center gap-1 text-yellow-500">
                ★ {app.averageRating.toFixed(1)}
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
        <CardFooter className="text-xs text-muted-foreground flex justify-between">
          <span>{app.viewCount} views</span>
          {app._count?.reviews ? <span>{app._count.reviews} reviews</span> : null}
        </CardFooter>
      </Card>
    </Link>
  );
}
