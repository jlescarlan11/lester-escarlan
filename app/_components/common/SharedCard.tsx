import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { LuExternalLink } from "react-icons/lu";

interface SharedCardProps {
  logo: string;
  mainTitle: string;
  subTitle: string;
  period: string;
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

      <div className="flex-1 flex flex-col mt-1 justify-center">
        <h3 className="font-bold text-base leading-tight">{mainTitle}</h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span>{subTitle}</span>
          <span>•</span>
          <span>{period}</span>
        </div>

        <p className="text-sm mt-2 leading-relaxed opacity-90">{detailsText}</p>

        {technologies.length > 0 && (
          <div className="flex gap-2 flex-wrap opacity-60 mt-3">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech.toLowerCase()}
              </Badge>
            ))}
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
