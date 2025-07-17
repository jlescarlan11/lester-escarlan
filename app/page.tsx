"use client";
import dynamic from "next/dynamic";
import LazySection from "./_components/common/LazySection";
import Navbar from "./_components/common/Navbar";
import AboutSection from "./_sections/About";
import ContactSection from "./_sections/Contact";
import EducationSection from "./_sections/Education";
import ExperienceSection from "./_sections/Experience";
import HeaderSection from "./_sections/Header";
import TechStackSection from "./_sections/TechStack";

const ProjectSection = dynamic(() => import("./_sections/Project"), {
  loading: () => (
    <div className="section">
      <div className="flex flex-col items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    </div>
  ),
  ssr: false,
});

const sections = [
  { id: "about", Component: AboutSection },
  { id: "education", Component: EducationSection },
  { id: "experience", Component: ExperienceSection },
  { id: "project", Component: ProjectSection },
  { id: "techstack", Component: TechStackSection },
  { id: "contact", Component: ContactSection },
];

export default function Home() {
  return (
    <>
      <HeaderSection />
      <Navbar />
      {sections.map(({ id, Component }) => (
        <LazySection key={id} effect="fade" id={id}>
          <Component />
        </LazySection>
      ))}
    </>
  );
}
