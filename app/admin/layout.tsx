import React, { PropsWithChildren } from "react";
import AuthCheck from "./AuthCheck";

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthCheck>
      <main className="min-h-dvh">{children}</main>;
    </AuthCheck>
  );
};

export default AdminLayout;
