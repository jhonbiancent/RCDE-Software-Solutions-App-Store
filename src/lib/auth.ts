// src/lib/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn() {
      // Allow login for everyone (needed for review/comment identity)
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).isAdmin =
          (token as any).username === process.env.ADMIN_GITHUB_USERNAME;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        // GitHub profile includes `login` as the username
        token.username = (profile as any).login;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
});
