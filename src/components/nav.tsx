import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "./ui/button";

export async function Nav() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.isAdmin;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 font-bold">
            AppShelf
          </Link>
          <div className="flex gap-4">
            <Link href="/apps" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Apps
            </Link>
            <Link href="/about" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button href="/admin" variant="outline" size="sm">
              Dashboard
            </Button>
          )}
          {session ? (
            <Link href="/api/auth/signout" className="text-sm font-medium hover:underline">
              Sign Out
            </Link>
          ) : (
            <Link href="/api/auth/signin" className="text-sm font-medium hover:underline">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
