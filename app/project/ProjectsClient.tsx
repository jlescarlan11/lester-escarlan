"use client";
import {
  Project,
  ProjectCardList,
} from "@/app/_components/common/ProjectCardList";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SectionTitle from "../_components/common/SectionTitle";

const ProjectsClient = (): React.ReactElement => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/project");

        if (response.data.success) {
          setProjects(response.data.data);
        } else {
          setError("Failed to fetch projects");
        }
      } catch {
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleRetry = () => window.location.reload();

  if (loading) {
    return (
      <>
        <SectionTitle section="Projects" description="Collection of my works" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SectionTitle section="Projects" description="Collection of my works" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-2">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SectionTitle section="Projects" description="Collection of my works" />
      <ProjectCardList
        data={projects}
        showActions={false}
        showViewAction={true}
        showAddButton={false}
      />
    </>
  );
};

export default ProjectsClient;
