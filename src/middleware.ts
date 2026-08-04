import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAdmin = (req.auth?.user as any)?.isAdmin;
  const isAuthPage = req.nextUrl.pathname.startsWith("/api/auth");

  // Protect /admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!req.auth) {
      // Redirect to login if not authenticated
      const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }
    
    if (!isAdmin) {
      // Redirect to home if not admin
      return Response.redirect(new URL("/", req.nextUrl.origin));
    }
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api/github|_next/static|_next/image|favicon.ico).*)"],
};
