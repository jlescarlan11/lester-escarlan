import React from "react";
import ProjectsClient from "./ProjectsClient";
import { Metadata } from "next";

const ProjectsPage = () => {
  return <ProjectsClient />;
};

export default ProjectsPage;

export const metadata: Metadata = {
  title: "Lester Escarlan | Projects",
  description: "Lester Escarlan's projects",
  keywords: [
    "Lester Escarlan",
    "Portfolio",
    "Web Developer",
    "Projects",
    "Experience",
    "Skills",
  ],
  authors: [
    { name: "Lester Escarlan", url: "https://lester-escarlan.vercel.app" },
  ],
  openGraph: {
    title: "Lester Escarlan | Projects",
    description: "Lester Escarlan's projects and development work.",
    url: "https://lester-escarlan.vercel.app/projects",
    siteName: "Lester Escarlan Portfolio",
    images: [
      {
        url: "https://lester-escarlan.vercel.app/profile-pic.jpg",
        width: 1200,
        height: 630,
        alt: "Lester Escarlan Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "https://lester-escarlan.vercel.app/projects",
  },
};
