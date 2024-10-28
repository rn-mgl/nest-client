import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const nestToken = request.cookies.get("nest_token");

  const tokenValue = nestToken?.value;

  if (!tokenValue) {
    return NextResponse.redirect(new URL(`/auth/login`, request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: "/nest/:path*",
};
