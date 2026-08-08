import Link from "next/link";
import {
  Plus,
  Pencil,
  Layers3,
  LayoutGrid,
  Monitor,
  Globe,
  Smartphone,
  Book,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "windows":
    case "mac":
    case "linux":
      return <Monitor className="h-3 w-3" />;
    case "webapp":
    case "website":
      return <Globe className="h-3 w-3" />;
    case "android":
    case "ios":
      return <Smartphone className="h-3 w-3" />;
    case "library/tool":
      return <Book className="h-3 w-3" />;
    default:
      return <Monitor className="h-3 w-3" />;
  }
};

export default async function AdminDashboard() {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your applications, categories, and portfolio.
          </p>
        </div>

        <Button size="lg" className="px-4 py-6">
          <Link href="/admin/apps/new" className="flex justify-center items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New App
          </Link>
        </Button>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="font-semibold">Applications</h2>
              <p className="text-sm text-muted-foreground">
                {apps.length} {apps.length === 1 ? "application" : "applications"}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Application</th>
                <th className="px-6 py-4">Platforms</th>
                <th className="px-6 py-4">Categories</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Layers3 className="h-10 w-10 opacity-40" />
                      <p>No applications have been added yet.</p>

                      <Button >
                        <Link href="/admin/apps/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Create your first app
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b transition-colors hover:bg-muted/30"
                  >
                    {/* App */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                          {app.iconUrl ? (
                            <img src={app.iconUrl} alt={app.name} className="h-full w-full object-cover" />
                          ) : (
                            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">{app.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {app.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Platforms */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {app.platforms.map((platform) => (
                          <Badge
                            key={platform}
                            variant="secondary"
                            className="gap-1"
                          >
                            {getPlatformIcon(platform)}
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {app.categories.map((category) => (
                          <Badge key={category} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <Badge className="px-4 py-4"
                        variant={
                          app.status === "PUBLISHED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-4 py-2"
                      >
                        <Link href={`/admin/apps/${app.id}/edit`} className="flex justify-center items-center">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}