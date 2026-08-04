import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppForm } from "@/components/app-form";

export default async function EditAppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await prisma.app.findUnique({
    where: { id },
  });

  if (!app) {
    notFound();
  }

  return (
    <div className="container py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit App</h1>
        <p className="text-muted-foreground">Update the details of your project.</p>
      </div>
      <div className="border p-6 rounded-md">
        <AppForm initialData={app} />
      </div>
    </div>
  );
}
