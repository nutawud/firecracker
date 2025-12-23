import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // log ดูใน terminal
  console.log("MIDDLEWARE:", req.nextUrl.pathname);

  // ถ้าไม่มี token → redirect
  if (!token) {
    return NextResponse.redirect(
      new URL("/signin", req.url)
    );
  }

  // ผ่าน
  return NextResponse.next();
}

export const config = {
  matcher: [
    "//:path*",
    "/calendar/:path*",
    "/profile/:path*",
  ],
};
