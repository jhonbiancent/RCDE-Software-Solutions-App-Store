import { AppForm } from "@/components/app-form";

export default function NewAppPage() {
  return (
    <div className="container py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Add New App</h1>
        <p className="text-muted-foreground">Publish a new app or project to your portfolio.</p>
      </div>
      <div className="border p-6 rounded-md">
        <AppForm />
      </div>
    </div>
  );
}
