import { ThemeProvider } from "@/components/theme-provider";
import { PropsWithChildren } from "react";
import AuthCheck from "./AuthCheck";

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthCheck>
        <div>{children}</div>
      </AuthCheck>
    </ThemeProvider>
  );
};

export default AdminLayout;
