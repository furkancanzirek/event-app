import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PROTECTED_ROUTES } from "./libs/routes";

const secret = process.env.NEXTAUTH_SECRET as string;

const isProtectedRoute = (pathname: string, routes: string[]) => {
  return routes.some((route) => {
    return pathname.includes(route);
  });
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  if (token) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isProtectedRoute(pathname, PROTECTED_ROUTES) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/payment/:path*", "/events/:path*","/login", "/register"],
};
