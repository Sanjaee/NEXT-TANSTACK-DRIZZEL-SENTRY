import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // Providers are defined in auth.ts to avoid Edge Runtime issues
} satisfies NextAuthConfig;
