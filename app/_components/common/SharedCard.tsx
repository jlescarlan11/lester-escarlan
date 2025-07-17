import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { LuExternalLink } from "react-icons/lu";
import DateDisplay from "./DateDisplay";
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
  period,
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

  const isValidDate =
    period instanceof Date
      ? !isNaN(period.getTime())
      : !isNaN(Date.parse(period));

  return (
    <Card
      className={clsx(
        "flex flex-col gap-2 bg-transparent border-none shadow-none",
        className
      )}
    >
      <div className="flex gap-4 items-start">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted border-2 border-muted-foreground/30 shadow-sm">
          <Image
            src={logo}
            alt={`${mainTitle} logo`}
            width={64}
            height={64}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-muted-foreground">{subTitle}</div>
          <h3 className="font-bold text-base leading-tight break-words">
            {mainTitle}
          </h3>
          <div className="text-xs text-muted-foreground">
            {isValidDate ? <DateDisplay date={period} /> : String(period)}
          </div>
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
    </Card>
  );
};

export default SharedCard;
