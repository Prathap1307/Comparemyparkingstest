import { auth } from "./lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [/^\/admin(.*)/];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isProtected = protectedPaths.some((regex) => regex.test(request.nextUrl.pathname));
  if (isProtected && !session?.user) {
    const url = new URL("/api/auth/signin", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
