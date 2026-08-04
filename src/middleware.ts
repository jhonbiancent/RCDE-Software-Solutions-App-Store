import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPath) {
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.nextUrl.origin));
    }
    if (!(session.user as any)?.isAdmin) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
