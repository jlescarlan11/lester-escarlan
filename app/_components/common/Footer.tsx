"use client";
import contact from "@/app/_data/contact";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  const { github, linkedin } = contact.contactInfo;

  return (
    <footer className="w-full bg-background/80 backdrop-blur py-8 mt-12">
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
