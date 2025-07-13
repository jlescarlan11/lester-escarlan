"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

const Breadcrumbs = () => {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="mb-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const label = segment.charAt(0).toUpperCase() + segment.slice(1);
            const isLast = index === segments.length - 1;

            // Check if we're on an edit page and this is the "edit" segment
            const isEditPage = pathname.includes("/edit/");
            const isEditSegment = segment === "edit";

            return (
              <React.Fragment key={`${segment}-${index}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast || (isEditPage && isEditSegment) ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
