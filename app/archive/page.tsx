import React from "react";
import ArchiveClient from "./ArchiveClient";
import { Metadata } from "next";

const ArchivePage = (): React.ReactElement => {
  return <ArchiveClient />;
};

export default ArchivePage;

export const metadata: Metadata = {
  title: "Lester Escarlan | Project Archive",
  description: "Lester Escarlan's project archive",
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
    title: "Lester Escarlan | Portfolio",
    description:
      "Lester Escarlan's personal portfolio showcasing skills, projects, and experience.",
    url: "https://lester-escarlan.vercel.app",
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
    canonical: "https://lester-escarlan.vercel.app",
  },
};
