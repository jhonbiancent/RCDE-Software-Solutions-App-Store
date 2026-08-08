import { AppForm } from "@/components/app-form";

export default function NewAppPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mx-auto mb-6 max-w-2xl space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Add New App</h1>
        <p className="text-muted-foreground">Publish a new app or project to your portfolio.</p>
      </div>
      <div className="mx-auto max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
        <AppForm />
      </div>
    </div>
  );
}
