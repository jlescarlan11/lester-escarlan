"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "project", label: "Project" },
  { id: "contact", label: "Contact" },
];

const NAVBAR_HEIGHT = 48; // px
const NAVBAR_TOP_OFFSET = 24; // px

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [shouldRender, setShouldRender] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      const scrollY = window.scrollY;

      // Don't render navbar if we're above the about section
      if (aboutSection) {
        const aboutOffset = aboutSection.offsetTop - 150; // 150px buffer before about section
        if (scrollY < aboutOffset) {
          setShouldRender(false);
          setShow(false);
          lastScrollY.current = scrollY;
          return;
        } else {
          setShouldRender(true);
        }
      }

      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = null;
      }

      // Normal show/hide logic when past about section
      if (scrollY > lastScrollY.current) {
        // Scrolling down - hide navbar
        setShow(false);
      } else {
        // Scrolling up - show navbar
        setShow(true);
      }

      // Always show navbar after user stops scrolling for 300ms
      scrollTimeout.current = setTimeout(() => {
        setShow(true);
      }, 300);

      lastScrollY.current = scrollY;
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleSectionHighlight = () => {
      const scrollY = window.scrollY;
      const aboutSection = document.getElementById("about");

      // Don't highlight any section if we're above the about section
      if (aboutSection) {
        const aboutOffset = aboutSection.offsetTop - 150; // Same buffer as render logic
        if (scrollY < aboutOffset) {
          setActiveSection("");
          return;
        }
      }

      let found = false;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(SECTIONS[i].id);
        if (section) {
          const offset = section.offsetTop - 200; // Adjust for navbar height
          if (scrollY >= offset) {
            setActiveSection(SECTIONS[i].id);
            found = true;
            break;
          }
        }
      }
      if (!found) setActiveSection("");
    };

    // Initial check
    handleSectionHighlight();

    window.addEventListener("scroll", handleSectionHighlight, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", handleSectionHighlight);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -(NAVBAR_HEIGHT + NAVBAR_TOP_OFFSET); // -72
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!shouldRender) return null;

  return (
    <nav
      className={cn(
        "fixed top-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-300 ease-in-out",
        show
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none"
      )}
    >
      <div className="max-w-fit px-4 sm:px-8 py-2 rounded-xl bg-background/80 backdrop-blur border border-border shadow-lg flex md:gap-4 mx-auto">
        {SECTIONS.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
            className={cn(
              "px-1 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors",
              activeSection === item.id
                ? "bg-primary text-primary-foreground shadow"
                : "hover:bg-muted hover:text-primary"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
