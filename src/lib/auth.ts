// src/lib/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // Allow login for everyone (needed for review/comment identity)
      return true;
    },
    async session({ session, token }) {
      // Flag isAdmin in the session for gating /admin routes
      // Note: In NextAuth v5, you might need to type augment Session to add isAdmin
      if (session.user) {
        (session.user as any).isAdmin = (token as any).username === process.env.ADMIN_GITHUB_USERNAME || false;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.username = profile.login;
      }
      return token;
    }
  },
  session: { strategy: "jwt" }
});
