import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/utils/index";

export async function middleware(req:NextRequest, ev:NextFetchEvent) {
  const token = req ? req.cookies?.get("token") : null;
  const userId = await verifyToken(token?.value||'');
  const { pathname } = req.nextUrl;
 
  // if (
  //   pathname.startsWith("/_next") ||
  //   pathname.includes("login") ||
  //   userId ||
  //   pathname.includes("/static")||
  //   ['','/'].includes(pathname)
  // ) {
    return NextResponse.next();
  // }

  // if ((!token || !userId) && pathname !== "/login") {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/youflix/login";
  //   return NextResponse.rewrite(url);
  // }
}
