import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const response = NextResponse.rewrite(new URL("/auth/login", req.url));

    if (!req.nextauth.token?.user.token) {
      return response;
    }

    const role = req.nextauth.token.user.role;
    const pathname = req.nextUrl.pathname;

    if (pathname.includes("/nest/admin") && role !== "admin") {
      return response;
    } else if (pathname.includes("/nest/employee") && role !== "employee") {
      return response;
    } else if (pathname.includes("/nest/hr") && role !== "hr") {
      return response;
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token?.user,
    },
  }
);

export const config = { matcher: "/nest/:path*" };
