import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { GET } from "../api/auth/[...nextauth]/route";

interface Session {
  user?: {
    email?: string;
  };
}

const AuthCheck = async ({ children }: { children: ReactNode }) => {
  const session = (await getServerSession(GET)) as Session | null;

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  // Check if the user's email matches the allowed admin email
  const allowedEmail = process.env.ADMIN_EMAIL!;
  const userEmail = session.user?.email;

  if (!userEmail || userEmail.toLowerCase() !== allowedEmail.toLowerCase()) {
    redirect("/auth/signin");
    return null;
  }

  return <>{children}</>;
};

export default AuthCheck;
