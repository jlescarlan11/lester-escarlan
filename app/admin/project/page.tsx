"use client";
import { ProjectDataTable } from "@/app/_components/common/ProjectDataTable";
import SectionTitle from "@/app/_components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { DeleteProjectModal } from "./_components/DeleteProjectModal";
import { toast } from "@/lib/toast";

interface Project {
  id: string;
  title: string;
  description: string;
  preview: string | null;
  technologies: string[];
  link: string;
  status: "featured" | "archived";
  createdAt: string;
  updatedAt: string;
}

const AdminProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    projectId: "",
    projectTitle: "",
  });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/project");
      if (response.data.success) {
        setProjects(response.data.data);
        // Only show success toast if this is not the initial load
        if (projects.length > 0) {
          toast.success("Projects refreshed successfully!");
        }
      } else {
        setError("Failed to fetch projects");
        toast.error("Failed to fetch projects");
      }
    } catch {
      setError("Failed to fetch projects");
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [projects.length]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openDeleteModal = (projectId: string, projectTitle: string) => {
    setDeleteModal({ isOpen: true, projectId, projectTitle });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, projectId: "", projectTitle: "" });
  };

  return (
    <>
      <SectionTitle
        section="Project Management"
        description="Manage your portfolio projects"
      />
      <div className="space-y-4">
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
            showActions={true}
            onDelete={openDeleteModal}
            showAddButton={true}
            addButtonHref="/admin/project/create"
            addButtonText="Add Project"
          />
        )}
      </div>
      <DeleteProjectModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        projectId={deleteModal.projectId}
        projectTitle={deleteModal.projectTitle}
        onDeleteSuccess={fetchProjects}
      />
    </>
  );
};

export default AdminProjectPage;
