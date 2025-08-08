import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import HeadingHiglight from "./HeadingHiglight";
import OverflowBadges from "./OverflowBadges";

interface SharedCardProps {
  logo: string;
  mainTitle: string;
  subTitle: string;
  period: string | Date;
  details: string | string[];
  technologies?: string[];
  link?: string;
  className?: string;
}

const SharedCard = ({
  logo,
  mainTitle,
  subTitle,
  details,
  technologies = [],
  link,
  className = "",
}: SharedCardProps) => {
  const detailsBullets = Array.isArray(details)
    ? details
    : details
        .split(".")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s + ".");

  return (
    <Card
      className={clsx(
        "flex sm:grid grid-cols-5 gap-4 lg:gap-8 bg-transparent border-none shadow-none",
        className
      )}
    >
      <div className="grid-cols-1 overflow-hidden border  aspect-square max-w-fit">
        <Image
          src={logo}
          alt={`${mainTitle} logo`}
          width={0}
          height={0}
          className="w-[300px] sm:w-full aspect-square"
          loading="lazy"
        />
      </div>
      <div className="col-span-4">
        <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0">
            <HeadingHiglight>{subTitle}</HeadingHiglight>
            <h3>{mainTitle}</h3>
          </div>
        </div>

        {technologies.length > 0 && (
          <div className="opacity-70 mt-1">
            <OverflowBadges technologies={technologies} />
          </div>
        )}

        {detailsBullets.length > 0 && (
          <ul className="text-sm mt-1 leading-relaxed opacity-90 list-disc list-outside pl-6">
            {detailsBullets.map((bullet, idx) => (
              <li key={idx} className="text-pretty">
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {link && (
          <Button
            variant="link"
            className="mt-1 p-0 text-xs justify-start"
            size="sm"
            asChild
          >
            <Link
              href={link}
              className="flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              View <LuExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SharedCard;
