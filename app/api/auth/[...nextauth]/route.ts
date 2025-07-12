import { prisma } from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      // Check if the user's email matches the allowed admin email
      const allowedEmail = process.env.ADMIN_EMAIL!;
      if (user.email?.toLowerCase() === allowedEmail.toLowerCase()) {
        return true;
      }
      // Return false to prevent sign in for unauthorized emails
      return false;
    },
    async session({ session, token }) {
      // Include the email in the session for client-side access
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Include email in the JWT token
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
