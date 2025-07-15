"use client";
import { useEffect, useState } from "react";
import LazySection from "./_components/common/LazySection";
import Navbar from "./_components/common/Navbar";
import NavbarSpacer from "./_components/common/NavbarSpacer";
import AboutSection from "./_sections/About";
import ContactSection from "./_sections/Contact";
import EducationSection from "./_sections/Education";
import ExperienceSection from "./_sections/Experience";
import HeaderSection from "./_sections/Header";
import ProjectSection from "./_sections/Project";
import TechStackSection from "./_sections/TechStack";

export default function Home() {
  const [showSpacer, setShowSpacer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      const scrollY = window.scrollY;
      if (aboutSection) {
        const aboutOffset = aboutSection.offsetTop - 150; // match Navbar logic
        setShowSpacer(scrollY >= aboutOffset);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <HeaderSection />
      <Navbar />
      <NavbarSpacer visible={showSpacer} />
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
