"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import SectionTitle from "../_components/common/SectionTitle";
import SharedCard from "../_components/common/SharedCard";
import getProjectData from "../_data/project";

interface Project {
  id: string;
  title: string;
  description: string;
  preview?: string;
  technologies?: string[];
  link?: string;
  status: string;
  createdAt: string;
}

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

  if (loading) {
    return (
      <section id="project" className="section">
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
      <section id="project" className="section">
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
    <section id="project" className="section">
      <SectionTitle section={section} description={sectionDescription} />

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="opacity-60">No featured projects available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="relative group">
              <SharedCard
                logo={project.preview || "/alliance-logo.svg"}
                mainTitle={project.title}
                subTitle={project.status}
                period={new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                details={[project.description]}
                technologies={project.technologies}
                link={project.link}
              />
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
