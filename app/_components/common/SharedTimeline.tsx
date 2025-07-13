import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import HeadingHiglight from "./HeadingHiglight";

interface SharedTimelineItem {
  logo: string;
  mainTitle: string;
  subTitle: string;
  period: string;
  details: string[];
  technologies?: string[];
}

interface SharedTimelineProps {
  items: SharedTimelineItem[];
}

const DOT_SIZE = 64;
const LINE_WIDTH = 2;

const SharedTimeline: React.FC<SharedTimelineProps> = ({ items }) => {
  return (
    <ul className="relative flex flex-col gap-8">
      {items.map((item, index) => (
        <li key={index} className="relative flex items-start mb-8  last:mb-0">
          {/* Vertical connecting line */}
          {index !== items.length - 1 && (
            <div
              className="absolute bg-muted-foreground/20 z-0"
              style={{
                left: DOT_SIZE / 2 - LINE_WIDTH / 2,
                top: DOT_SIZE,
                width: LINE_WIDTH,
                height: `calc(100% + 32px - ${DOT_SIZE}px)`, // Extended to connect properly
              }}
            />
          )}

          {/* Timeline dot with logo */}
          <div className="relative z-10 flex-shrink-0 mr-8">
            <div className="w-16 h-16 rounded-full bg-background border-2 border-muted-foreground/30 shadow-sm overflow-hidden flex items-center justify-center">
              <Image
                src={item.logo}
                alt={`${item.mainTitle} logo`}
                width={DOT_SIZE}
                height={DOT_SIZE}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-col mb-2">
              <HeadingHiglight>
                {item.subTitle} ({item.period})
              </HeadingHiglight>
              <div className="text-lg font-black text-primary">
                {item.mainTitle}
              </div>
              {/* Technologies */}
              {item.technologies!.length > 0 && (
                <div className="flex gap-2 flex-wrap opacity-60">
                  {item.technologies!.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tech.toLocaleLowerCase()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <ul className="mt-2 space-y-1 pl-5">
              {item.details.map((detail, i) => (
                <li key={i} className="">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SharedTimeline;
