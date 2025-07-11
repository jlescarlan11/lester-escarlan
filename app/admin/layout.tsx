import React, { PropsWithChildren } from "react";

const AdminLayout = ({ children }: PropsWithChildren) => {
  return <main>{children}</main>;
};

export default AdminLayout;
