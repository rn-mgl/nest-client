import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const response = NextResponse.rewrite(new URL("/auth/login", req.url));

    if (
      !req.nextauth.token?.user.token ||
      !req.nextauth.token.user.permissions?.length
    ) {
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
