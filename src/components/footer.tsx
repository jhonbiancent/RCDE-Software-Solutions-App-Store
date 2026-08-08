import Link from "next/link";
import { Boxes, LayoutGrid, Info } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container py-10 ">
        <div className="flex-col md:flex-row flex md:flex justify-between items-center md:items-start px-10 md:px-20">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Boxes className="h-5 w-5 text-primary" />
              </div>

              <div className="">
                <h3 className="font-semibold">AppShelf</h3>
                <p className="text-sm text-muted-foreground">
                  Discover and organize your favorite applications.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-20 md:mt-0 mt-6"> 
            {/* Navigation */}
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Navigation
              </h4>

              <nav className="space-y-2">
                <Link
                  href="/apps"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Apps
                </Link>

                <Link
                  href="/about"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Info className="h-4 w-4" />
                  About
                </Link>
              </nav>
            </div>

            {/* Resources / Social */}
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Connect
              </h4>

              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </Link>
            </div>
            </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between px-10 md:px-20 gap-3 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} AppShelf. All rights reserved.</p>

          <p>
            Built by {" "}
            <span className="font-medium text-foreground">Jhon Biancent Recede</span> 
          </p>
        </div>
      </div>
    </footer>
  );
}