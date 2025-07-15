import { Metadata } from "next";
import AboutSection from "./_sections/About";
import ContactSection from "./_sections/Contact";
import EducationSection from "./_sections/Education";
import ExperienceSection from "./_sections/Experience";
import HeaderSection from "./_sections/Header";
import ProjectSection from "./_sections/Project";
import TechStackSection from "./_sections/TechStack";
import Navbar from "./_components/common/Navbar";

const SITE_URL = "https://lester-escarlan.vercel.app";
const SITE_TITLE = "Lester Escarlan | Portfolio";
const SITE_DESCRIPTION =
  "Lester Escarlan's personal portfolio showcasing skills, projects, and experience.";

export default function Home() {
  return (
    <>
      <HeaderSection />
      <Navbar />
      <section id="about">
        <AboutSection />
      </section>
      <section id="education">
        <EducationSection />
      </section>
      <section id="experience">
        <ExperienceSection />
      </section>
      <section id="project">
        <ProjectSection />
      </section>
      <section id="techstack">
        <TechStackSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
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
