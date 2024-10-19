"use client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/" || path === "/login" || path === "/signup";
  const token = request.cookies.get("next-auth.session-token")?.value || "";
  const cookie = request.cookies.get("userType");
  if (path === "/signup") {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Denied Access" }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  if (isPublicPath && token) {
    if (cookie?.value === "Lawyer") {
      return NextResponse.redirect(new URL("/storage", request.nextUrl));
    } else if (cookie?.value === "Admin") {
      return NextResponse.redirect(new URL("/admin", request.nextUrl));
    }
  }
  if (!isPublicPath && !token) {
    // return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/login", "/signup","/storage","/research","/draft"],
};
