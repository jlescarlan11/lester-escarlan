"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, Suspense } from "react";
import { toast } from "@/lib/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function AuthErrorContent() {
  const params = useSearchParams();
  const error = params.get("error");

  useEffect(() => {
    if (error === "AccessDenied") {
      toast.error("You are not authorized to access the admin panel.");
    } else if (error) {
      toast.error("An authentication error occurred.");
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-destructive">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            {error === "AccessDenied"
              ? "You are not authorized to access the admin panel."
              : "An authentication error occurred."}
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              Back to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
