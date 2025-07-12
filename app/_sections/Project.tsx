"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuExternalLink } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionTitle from "../_components/common/SectionTitle";
import getProjectData from "../_data/project";
import HeadingHiglight from "../_components/common/HeadingHiglight";

interface Project {
  id: string;
  title: string;
  description: string;
  preview?: string;
  technologies?: string[];
  link?: string;
}

const DEFAULT_PREVIEW =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='system-ui' font-size='16'%3ENo Preview%3C/text%3E%3C/svg%3E";

const ProjectSection = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectData();
        setProjects(data.projectData || []);
        setSection(data.section);
        setSectionDescription(data.sectionDescription);
      } catch {
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getAlignmentClasses = (index: number, baseClass: string = "") => {
    const isReversed = index % 2 !== 0;
    const alignmentMap = {
      order: isReversed ? "md:order-2" : "",
      contentOrder: isReversed ? "md:order-1" : "",
      textAlign: isReversed ? "text-start" : "text-end",
      itemsAlign: isReversed ? "items-start" : "items-end",
      justifyAlign: isReversed ? "justify-start" : "justify-end",
      cardMargin: isReversed ? "-mr-20 ml-0" : "-ml-20 mr-0",
    };
    return alignmentMap[baseClass as keyof typeof alignmentMap] || "";
  };

  const TechnologyBadges = ({
    technologies,
    index,
  }: {
    technologies?: string[];
    index: number;
  }) => (
    <div
      className={`flex gap-2 flex-wrap opacity-60 mb-4 ${getAlignmentClasses(
        index,
        "justifyAlign"
      )}`}
    >
      {technologies?.map((tech, techIndex) => (
        <Badge key={techIndex} variant="secondary" className="text-xs">
          {tech.toLowerCase()}
        </Badge>
      ))}
    </div>
  );

  const ProjectLink = ({ link }: { link?: string }) => {
    if (!link) return null;
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href={link} target="_blank" rel="noopener noreferrer">
          <LuExternalLink className="w-4 h-4" />
        </Link>
      </Button>
    );
  };

  const MobileOverlay = ({ project }: { project: Project }) => (
    <div className="md:hidden absolute inset-0 flex flex-col justify-center items-start bg-background/90 p-6 rounded-lg z-20">
      <HeadingHiglight>Featured Project</HeadingHiglight>
      <h3 className="text-xl sm:text-2xl font-bold mb-3">{project.title}</h3>
      <p className="text-sm sm:text-base mb-4 text-muted-foreground">
        {project.description}
      </p>
      <TechnologyBadges technologies={project.technologies} index={0} />
      <ProjectLink link={project.link} />
    </div>
  );

  const DesktopContent = ({
    project,
    index,
  }: {
    project: Project;
    index: number;
  }) => (
    <div
      className={`hidden md:flex flex-col space-y-4 col-span-2 ${getAlignmentClasses(
        index,
        "contentOrder"
      )} ${getAlignmentClasses(index, "itemsAlign")}`}
    >
      <div
        className={`flex flex-col ${getAlignmentClasses(index, "itemsAlign")}`}
      >
        <HeadingHiglight>Featured Project</HeadingHiglight>
        <h3
          className={`text-2xl font-bold ${getAlignmentClasses(
            index,
            "textAlign"
          )}`}
        >
          {project.title}
        </h3>
      </div>

      <Card
        className={`${getAlignmentClasses(
          index,
          "cardMargin"
        )} bg-card/95 backdrop-blur-sm border-border/50 z-10 relative shadow-sm`}
      >
        <CardContent
          className={`p-4 ${getAlignmentClasses(index, "textAlign")}`}
        >
          <p className="leading-relaxed">{project.description}</p>
        </CardContent>
      </Card>

      <TechnologyBadges technologies={project.technologies} index={index} />
      <ProjectLink link={project.link} />
    </div>
  );

  if (loading) {
    return (
      <section className="section">
        <SectionTitle section={section} description={sectionDescription} />
        <div className="flex flex-col items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <SectionTitle section={section} description={sectionDescription} />
        <div className="flex flex-col items-center py-8">
          <p className="text-destructive mb-2">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <SectionTitle section={section} description={sectionDescription} />

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="opacity-60">No featured projects available</p>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="relative grid grid-cols-1 md:grid-cols-5 justify-center items-center gap-4 md:gap-8"
            >
              {/* Project Image */}
              <div
                className={`col-span-3 ${getAlignmentClasses(
                  index,
                  "order"
                )} relative h-[280px] md:h-[320px]`}
              >
                <div className="absolute inset-0 bg-background/40 transition-opacity duration-300 rounded-lg z-10 md:hidden"></div>

                <Image
                  width={550}
                  height={320}
                  src={project.preview || DEFAULT_PREVIEW}
                  alt={`Preview image of ${project.title}`}
                  className="rounded-lg object-cover w-full h-full transition-all duration-300 border-2 border-muted-foreground/30 shadow-sm"
                />

                <div className="hidden md:block absolute inset-0 bg-background/40 hover:opacity-0 transition-opacity duration-300 rounded-lg z-10"></div>

                <MobileOverlay project={project} />
              </div>

              <DesktopContent project={project} index={index} />
            </div>
          ))}

          {/* Archive Link */}
          <div className="text-start mt-12">
            <Link
              href="/archive"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary relative inline-block group text-sm"
            >
              <div className="flex items-center gap-2">
                View more in archive{" "}
                <LuArrowRight className="text-primary mt-0.5 flex-shrink-0" />
              </div>
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectSection;
