"use client";
import React, { useRef, useState, useEffect } from "react";

type LazySectionProps = {
  children: React.ReactNode;
  className?: string;
  effect?: "fade" | "slide";
  threshold?: number;
};

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = "",
  effect = "fade",
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = () => setReduceMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);

    const timeout = setTimeout(() => {
      setIsVisible(true);
      observer.disconnect();
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [threshold]);

  const getEffectClass = () => {
    if (reduceMotion) {
      return isVisible ? "opacity-100" : "opacity-0";
    }

    const baseTransition = "transition-all duration-700 ease-out";
    const slideTransform = effect === "slide" ? " translate-y-8" : "";
    const visibleTransform =
      effect === "slide" && isVisible ? " translate-y-0" : "";

    return `${baseTransition} opacity-0${slideTransform}${isVisible ? " opacity-100" : ""}${visibleTransform}`;
  };

  return (
    <div
      ref={ref}
      className={`${className} ${getEffectClass()}`.trim()}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </div>
  );
};

export default LazySection;
