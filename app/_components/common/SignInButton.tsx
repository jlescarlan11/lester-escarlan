"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  children?: React.ReactNode;
  provider?: string;
  callbackUrl?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const SignInButton: React.FC<SignInButtonProps> = ({
  children = "Sign In",
  provider = "google",
  callbackUrl = "/",
  variant = "default",
  size = "default",
  className,
  ...props
}) => {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => signIn(provider, { callbackUrl })}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SignInButton;
