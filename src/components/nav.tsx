import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "./ui/button";
import {
  AppWindow,
  Globe,
  Layers,
  Monitor,
  Mail,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
} from "lucide-react";

const navLinks = [
  { href: "/websites", label: "Websites", icon: Globe },
  { href: "/webapps", label: "Web Apps", icon: Layers },
  { href: "/desktop", label: "Desktop", icon: Monitor },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export async function Nav() {
  const session = await auth();
  const isAdmin = Boolean((session?.user as { isAdmin?: boolean } | undefined)?.isAdmin);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto grid h-16 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <AppWindow className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">AppShelf</span>
        </Link>

        <div className="flex items-center justify-center gap-1 rounded-lg border bg-white p-1 shadow-sm">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={label}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          {isAdmin && (
            <Button href="/admin" variant="outline" size="sm" className="h-10">
              <LayoutDashboard className="size-4 " aria-hidden="true" />
              Dashboard
            </Button>
          )}
          {session ? (
            <Link
              href="/api/auth/signout"
              className="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </Link>
          ) : (
            <Link
              href="/api/auth/signin"
              className="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogIn className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
