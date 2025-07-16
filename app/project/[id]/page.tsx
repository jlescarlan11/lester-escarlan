"use client";

import SectionTitle from "@/app/_components/common/SectionTitle";
import DateDisplay from "@/app/_components/common/DateDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[] | string;
  link: string;
  status: "featured" | "archived";
  preview: string | null;
  createdAt: string;
  updatedAt: string;
}

const ProjectViewPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`/api/project/${id}`);
        setProject(data.data);
      } catch {
        setError("Project not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (error)
    return <div className="py-12 text-center text-destructive">{error}</div>;
  if (!project)
    return <div className="py-12 text-center">No project found.</div>;

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : project.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        section="Project Detail"
        description="View the project detail"
      />

      <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
        <div className="w-32 h-32 relative bg-muted rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={project.preview || "/alliance-logo.svg"}
            alt={`${project.title} preview`}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>

        <div className="flex flex-col justify-center sm:justify-start flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
          <span className="text-muted-foreground text-sm mt-2">
            <DateDisplay date={project.createdAt} />
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
      </div>

      <p className="text-base sm:text-lg whitespace-pre-line">
        {project.description}
      </p>

      {project.link && (
        <Link href={project.link} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">View App</Button>
        </Link>
      )}
    </div>
  );
};

export default ProjectViewPage;
