import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
export default authMiddleware({
  publicRoutes: ["/api/auth", "/api/chat"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
