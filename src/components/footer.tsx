import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-auto py-8 bg-muted/30">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Built with Next.js & ❤️ — AppShelf
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/apps" className="hover:text-foreground transition-colors">Apps</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
}
