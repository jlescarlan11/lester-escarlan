"use client";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { LuArrowUp } from "react-icons/lu";
import contact from "@/app/_data/contact";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();
  const { github, linkedin } = contact.contactInfo;

  const handleScrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full bg-background/80 backdrop-blur py-8 mt-12">
      {/* Arrow Up Button - floating at the top center border */}
      <button
        onClick={handleScrollTop}
        aria-label="Back to top"
        className="absolute left-1/2 -top-5 -translate-x-1/2 rounded-full p-2 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors shadow z-10"
      >
        <LuArrowUp className="w-5 h-5" />
      </button>
      <div className=" flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        {/* Left: Copyright */}
        <div className="text-muted-foreground text-center md:text-left">
          &copy; {year} John Lester Escarlan. All rights reserved.
        </div>
        {/* Right: Social Icons Only */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-3 mb-1">
            <Link
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5 hover:text-primary transition-colors" />
            </Link>
            <Link
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5 hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
