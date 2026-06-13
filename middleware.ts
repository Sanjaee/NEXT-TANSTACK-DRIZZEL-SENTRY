import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Daftar awalan rute yang wajib login
const protectedRoutes = ["/dashboard"];

// Daftar rute khusus otentikasi
const authRoutes = ["/login", "/register"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  // Jika rute API auth, biarkan NextAuth yang urus
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Jika user sudah login tapi mencoba ke halaman login/register -> lemparkan ke dashboard
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  // Jika user BELUM login dan mencoba mengakses area terproteksi -> lemparkan ke login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", req.nextUrl);
    // (Opsional) Simpan jejak URL tujuan asli
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Izinkan akses jika tidak melanggar aturan di atas
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
