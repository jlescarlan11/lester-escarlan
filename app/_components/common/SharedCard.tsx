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
  const detailsText = Array.isArray(details) ? details.join(" ") : details;
  const isValidDate =
    typeof period === "string"
      ? !isNaN(Date.parse(period))
      : period instanceof Date && !isNaN(period.getTime());

  return (
    <Card
      className={clsx(
        "flex flex-row gap-4 items-start bg-transparent border-none shadow-none",
        className
      )}
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted border-2 border-muted-foreground/30 shadow-sm">
        <Image
          src={logo}
          alt={`${mainTitle} logo`}
          width={56}
          height={56}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="flex-1 mt-1">
        <h3 className="font-bold text-base leading-tight">{mainTitle}</h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
          <span>{subTitle}</span>
          <span>•</span>
          {isValidDate ? (
            <DateDisplay date={period} />
          ) : (
            <span>{period instanceof Date ? period.toString() : period}</span>
          )}
        </div>

        <p className="text-sm mt-2 leading-relaxed opacity-90">{detailsText}</p>

        {technologies.length > 0 && (
          <div className="opacity-60 mt-3">
            <OverflowBadges technologies={technologies} />
          </div>
        )}

        {link && (
          <Button
            variant="link"
            className="mt-3 p-0 text-xs justify-start"
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
