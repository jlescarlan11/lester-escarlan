"use client";
import LazySection from "./_components/common/LazySection";
import Navbar from "./_components/common/Navbar";
import AboutSection from "./_sections/About";
import ContactSection from "./_sections/Contact";
import EducationSection from "./_sections/Education";
import ExperienceSection from "./_sections/Experience";
import HeaderSection from "./_sections/Header";
import ProjectSection from "./_sections/Project";
import TechStackSection from "./_sections/TechStack";

export default function Home() {
  return (
    <>
      <HeaderSection />
      <Navbar />
      <LazySection effect="fade" id="about">
        <AboutSection />
      </LazySection>
      <LazySection effect="slide" id="education">
        <EducationSection />
      </LazySection>
      <LazySection effect="fade" id="experience">
        <ExperienceSection />
      </LazySection>
      <LazySection effect="slide" id="project">
        <ProjectSection />
      </LazySection>
      <LazySection effect="fade" id="techstack">
        <TechStackSection />
      </LazySection>
      <LazySection effect="slide" id="contact">
        <ContactSection />
      </LazySection>
    </>
  );
}
