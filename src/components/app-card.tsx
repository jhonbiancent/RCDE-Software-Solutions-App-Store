import Image from "next/image";
import Link from "next/link";
import {
  AppWindow,
  Apple,
  Box,
  Download,
  Eye,
  Globe,
  Laptop,
  Monitor,
  Smartphone,
  Star,
} from "lucide-react";

import { AppWithRating } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

const platformIcons: Record<string, React.ReactNode> = {
  Android: <Smartphone className="size-3.5" />,
  IOS: <Apple className="size-3.5" />,
  WebApp: <Globe className="size-3.5" />,
  Website: <Globe className="size-3.5" />,
  Windows: <Monitor className="size-3.5" />,
  Mac: <Laptop className="size-3.5" />,
  Linux: <Box className="size-3.5" />,
  "Library/Tool": <AppWindow className="size-3.5" />,
};

export function AppCard({ app }: { app: AppWithRating }) {
  return (
    <Link href={`/apps/${app.slug}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1  hover:shadow-lg">
        <CardHeader className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                {app.iconUrl ? (
                  <Image
                    src={app.iconUrl}
                    alt={`${app.name} icon`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <AppWindow
                    className="size-8 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="min-w-0">
                <CardTitle className="truncate text-lg font-semibold transition-colors group-hover:text-black">
                  {app.name}
                </CardTitle>

                <CardDescription className="mt-1 line-clamp-2">
                  {app.tagline || app.description}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm font-medium">
              <Star className="size-4 fill-current" />
              {(app.averageRating ?? 5).toFixed(1)}
            </div>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-2">
            {app.platforms.map((platform) => (
              <Badge
                key={platform}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {platformIcons[platform] ?? (
                  <AppWindow className="size-3.5" />
                )}
                {platform}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {app.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {app.techStack.slice(0, 3).map((tech: string) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/30">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1">
                <Eye className="size-4" />
                <span>{app.viewCount}</span>
              </div>

              <div className="flex items-center gap-1">
                <Download className="size-4" />
                <span>0</span>
              </div>
            </div>

            <span>{app._count?.reviews ?? 0} reviews</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}