import { verifyToken } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip middleware for Next.js internal routes
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Get the session cookie
  const sessionCookie = request.cookies.get("session");


  // Verify the session using your existing decrypt function
  let user = null;
  if (sessionCookie?.value) {
   try {
      user = await verifyToken(sessionCookie.value);
    } catch (error) {
      // Handle JWT expired or any other verification errors
      console.log("Token verification failed:");
      
      // Delete the expired/invalid cookie
      const response = NextResponse.next();
      response.cookies.set("session", "", {
        expires: new Date(0),
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      return response;
    }
  }

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Redirect unauthenticated users trying to access protected routes
  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname === "/signin" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
