"use client";
import { usePathname } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";

const BreadcrumbsWrapper = () => {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  return <Breadcrumbs />;
};

export default BreadcrumbsWrapper; 