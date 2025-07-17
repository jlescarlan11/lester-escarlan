import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface OverflowBadgesProps {
  technologies: string[];
  className?: string;
}

const OverflowBadges: React.FC<OverflowBadgesProps> = ({
  technologies,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(technologies.length);

  const measureBadges = React.useCallback(() => {
    if (!containerRef.current || !measureRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const badgeNodes = Array.from(measureRef.current.children) as HTMLElement[];
    const plusBadgeWidth = 40;

    let totalWidth = 0;
    let fits = 0;

    for (let i = 0; i < badgeNodes.length; i++) {
      const badge = badgeNodes[i];
      totalWidth += badge.offsetWidth + 8; // 8px gap

      // Reserve space for +N badge if there are more items
      const needsReserve = i < badgeNodes.length - 1;
      if (totalWidth + (needsReserve ? plusBadgeWidth : 0) > containerWidth) {
        break;
      }
      fits++;
    }

    setVisibleCount(fits);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measureBadges);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measureBadges]);

  React.useEffect(() => {
    requestAnimationFrame(measureBadges);
  }, [technologies, measureBadges]);

  return (
    <>
      <div
        ref={containerRef}
        className={`flex gap-2 overflow-hidden ${className || ""}`}
      >
        {technologies
          .slice()
          .sort((a, b) => a.localeCompare(b))
          .slice(0, visibleCount)
          .map((technology) => (
            <Badge
              key={technology}
              variant="secondary"
              className="text-xs whitespace-nowrap"
            >
              {technology.toLowerCase()}
            </Badge>
          ))}
        {visibleCount < technologies.length && (
          <Badge variant="secondary" className="text-xs whitespace-nowrap">
            +{technologies.length - visibleCount}
          </Badge>
        )}
      </div>

      <div
        ref={measureRef}
        className="absolute left-0 top-0 opacity-0 pointer-events-none"
        style={{
          visibility: "hidden",
          left: "-9999px",
          height: 0,
        }}
        aria-hidden="true"
      >
        {technologies
          .slice()
          .sort((a, b) => a.localeCompare(b))
          .map((technology) => (
            <Badge
              key={technology}
              variant="secondary"
              className="text-xs whitespace-nowrap"
            >
              {technology}
            </Badge>
          ))}
      </div>
    </>
  );
};

export default OverflowBadges;
