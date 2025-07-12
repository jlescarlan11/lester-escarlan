import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface SharedCardProps {
  logo: string;
  mainTitle: string;
  subTitle: string;
  period: string;
  details: string[];
  technologies?: string[];
}

const SharedCard = ({
  logo,
  mainTitle,
  subTitle,
  period,
  details,
  technologies = [],
}: SharedCardProps) => (
  <Card className="flex flex-row gap-8 p-8">
    <div className="w-20 h-20 rounded-full border-2 border-muted-foreground/30 shadow-sm overflow-hidden flex-shrink-0">
      <Image
        src={logo}
        alt={`${mainTitle} logo`}
        width={80}
        height={80}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 flex flex-col">
      <div>
        <div className="font-mono text-xs text-muted-foreground mt-2">
          {subTitle} ({period})
        </div>
        <h3>{mainTitle}</h3>
        {Array.isArray(technologies) && technologies.length > 0 && (
          <div className="flex gap-2 flex-wrap opacity-60 mb-4">
            {technologies.map((tech, techIndex) => (
              <Badge key={techIndex} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <ul className="space-y-1 mt-4">
        {details.map((detail, i) => (
          <li key={i} className="">
            {detail}
          </li>
        ))}
      </ul>
    </div>
  </Card>
);

export default SharedCard;
