import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !(session.user as any)?.isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex flex-col">
      <div className="border-b bg-muted/30">
        <div className="container py-3 flex items-center gap-2 text-sm text-muted-foreground px-6 md:px-10 lg:px-16">
          <span className="font-semibold text-foreground">Admin</span>
          <span>/</span>
          <span>Dashboard</span>
        </div>
      </div>
      {children}
    </div>
  );
}
