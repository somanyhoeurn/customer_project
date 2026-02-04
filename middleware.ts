import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isLoggedIn = !!req.nextauth.token;
    const isAuthRoute =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");

    if (isAuthRoute && isLoggedIn) {
      return NextResponse.redirect(new URL("/customers", req.nextUrl.origin));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login",
      error: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
        const isCustomers = req.nextUrl.pathname.startsWith("/customers");
        const isAuthRoute =
          req.nextUrl.pathname.startsWith("/login") ||
          req.nextUrl.pathname.startsWith("/register");
        if (isDashboard || isCustomers) return !!token;
        if (isAuthRoute) return true;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/customers/:path*", "/login", "/register"],
};
