import { Metadata } from "next";
import AboutSection from "./_sections/About";
import ContactSection from "./_sections/Contact";
import EducationSection from "./_sections/Education";
import ExperienceSection from "./_sections/Experience";
import HeaderSection from "./_sections/Header";
import ProjectSection from "./_sections/Project";
import TechStackSection from "./_sections/TechStack";
import Navbar from "./_components/common/Navbar";
import LazySection from "./_components/common/LazySection";

const SITE_URL = "https://lester-escarlan.vercel.app";
const SITE_TITLE = "Lester Escarlan | Portfolio";
const SITE_DESCRIPTION =
  "Lester Escarlan's personal portfolio showcasing skills, projects, and experience.";

export default function Home() {
  return (
    <>
      <HeaderSection />
      <Navbar />
      <LazySection effect="fade">
        <AboutSection />
      </LazySection>
      <LazySection effect="slide">
        <EducationSection />
      </LazySection>
      <LazySection effect="fade">
        <ExperienceSection />
      </LazySection>
      <LazySection effect="slide">
        <ProjectSection />
      </LazySection>
      <LazySection effect="fade">
        <TechStackSection />
      </LazySection>
      <LazySection effect="slide">
        <ContactSection />
      </LazySection>
    </>
  );
}

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "Lester Escarlan",
    "Portfolio",
    "Web Developer",
    "Projects",
    "Experience",
    "Skills",
  ],
  authors: [{ name: "Lester Escarlan", url: SITE_URL }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Lester Escarlan Portfolio",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
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
    canonical: SITE_URL,
  },
};
