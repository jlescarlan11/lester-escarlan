"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInButton from "../../_components/common/SignInButton";
import { toast } from "@/lib/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SigninPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      const allowedEmail =
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || "11@gmail.com";
      const userEmail = session.user?.email;

      if (userEmail && userEmail.toLowerCase() !== allowedEmail.toLowerCase()) {
        toast.error(
          `Access denied. Only ${allowedEmail} is authorized to access the admin panel.`
        );
        // Sign out the unauthorized user
        router.push("/api/auth/signout");
      } else if (
        userEmail &&
        userEmail.toLowerCase() === allowedEmail.toLowerCase()
      ) {
        // Authorized user, redirect to admin
        router.push("/admin");
      }
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="card-title">Admin Access</CardTitle>
          <CardDescription>
            Please sign in to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Only authorized administrators can access this area.
          </p>
          <SignInButton className="w-full" size="lg">
            Sign In with Google
          </SignInButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninPage;
