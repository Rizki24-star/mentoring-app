import { useSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // const { data: session } = useSession();

  // if (!session) {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/auth/signin";
  // }

  // return NextResponse.next();
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/tests/:path*"],
};
