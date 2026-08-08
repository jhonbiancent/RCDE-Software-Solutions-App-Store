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
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mx-auto mb-6 max-w-2xl space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Edit App</h1>
        <p className="text-muted-foreground">Update the details of your project.</p>
      </div>
      <div className="mx-auto max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
        <AppForm initialData={app} />
      </div>
    </div>
  );
}
