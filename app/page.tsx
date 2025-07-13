import AboutSection from "./_sections/About";
import ContactSection from "./_sections/Contact";
import EducationSection from "./_sections/Education";
import ExperienceSection from "./_sections/Experience";
import HeaderSection from "./_sections/Header";
import ProjectSection from "./_sections/Project";
import Navbar from "./_components/common/Navbar";
import TechStackSection from "./_sections/TechStack";

export default function Home() {
  return (
    <>
      <HeaderSection />
      <Navbar />
      <AboutSection />
      <EducationSection />
      <ExperienceSection />
      <ProjectSection />
      <TechStackSection />
      <ContactSection />
    </>
  );
}
