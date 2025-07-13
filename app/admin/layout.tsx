import React, { PropsWithChildren } from "react";
import AuthCheck from "./AuthCheck";
import { ThemeProvider } from "@/components/theme-provider";
import Breadcrumbs from "@/app/_components/common/Breadcrumbs";

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthCheck>
        <div className="py-8">
          <Breadcrumbs />
          {children}
        </div>
      </AuthCheck>
    </ThemeProvider>
  );
};

export default AdminLayout;
