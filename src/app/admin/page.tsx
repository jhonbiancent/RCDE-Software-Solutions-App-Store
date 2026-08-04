import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your apps and portfolio.</p>
        </div>
        <Button href="/admin/apps/new">Add New App</Button>
      </div>

      <div className="border rounded-md">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                  No apps found. Create one!
                </td>
              </tr>
            ) : (
              apps.map((app) => (
                <tr key={app.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium">{app.name}</td>
                  <td className="px-6 py-4">{app.category}</td>
                  <td className="px-6 py-4">
                    <Badge variant={app.status === "PUBLISHED" ? "default" : "secondary"}>
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/apps/${app.id}/edit`}
                      className="font-medium text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
