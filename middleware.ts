import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCSRFToken } from "./src/utils/token";
import { getCookie } from "cookies-next";

export const middleware = async (request: NextRequest) => {
  const nestToken = request.cookies.get("nest_token");

  const tokenValue = nestToken?.value;

  if (!tokenValue) {
    return NextResponse.redirect(new URL(`/auth/login`, request.url));
  }

  try {
    const { token } = await getCSRFToken(process.env.URL!);

    if (token) {
      const { data } = await axios.get(`${process.env.URL}/verify`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
        withCredentials: true,
      });

      if (data.isVerified) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
    }
  } catch (error) {
    return NextResponse.redirect(new URL(`/auth/login`, request.url));
  }
};

export const config = {
  matcher: "/nest/:path*",
};
