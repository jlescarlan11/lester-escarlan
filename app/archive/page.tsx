"use client";
import React from "react";
import { ProjectDataTable, Project } from "@/app/_components/common/ProjectDataTable";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import SectionTitle from "../_components/common/SectionTitle";
import Breadcrumbs from "@/app/_components/common/Breadcrumbs";

const ArchivePage = (): React.ReactElement => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Breadcrumbs />
      <SectionTitle
        section="Project Archive"
        description="Browse all projects in the archive"
      />
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-2">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <ProjectDataTable
            data={projects}
            showActions={false}
            showViewAction={true}
            showAddButton={false}
          />
        )}
      </div>
    </>
  );
};

export default ArchivePage;
