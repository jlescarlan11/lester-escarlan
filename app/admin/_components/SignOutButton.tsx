"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({
  children = "Log Out",
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
      onClick={() => signOut({ callbackUrl: "/" })}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SignOutButton;
