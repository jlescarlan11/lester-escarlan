import { Button } from "@/components/ui/button";
import React from "react";
import header from "../_data/header";
import Link from "next/link";
import HeadingHiglight from "../_components/common/HeadingHiglight";

const HeaderSection = () => {
  return (
    <header id="header" className="min-h-dvh flex items-center">
      <div className="space-y-4 ">
        <div>
          <HeadingHiglight>HI, MY NAME IS</HeadingHiglight>
          <h1>{header.name}</h1>
        </div>
        <p className="text-sm max-w-xl">{header.description}</p>
        <div className="flex gap-2">
          {header.buttons.map((button) => (
            <Button key={button.label} asChild>
              <Link
                href={button.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                {button.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
