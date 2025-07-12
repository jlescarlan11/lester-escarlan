"use client";
import Breadcrumbs from "@/app/_components/common/Breadcrumbs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteProjectModal } from "./_components/DeleteProjectModal";
import { createColumns, Project } from "./columns";
import { DataTable } from "./data-table";

const AdminProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    projectId: "",
    projectTitle: "",
  });

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

  const openDeleteModal = (projectId: string, projectTitle: string) => {
    setDeleteModal({ isOpen: true, projectId, projectTitle });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, projectId: "", projectTitle: "" });
  };

  return (
    <>
      <div>
        <Breadcrumbs />
        <header>
          <h1>Project Management</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </header>
      </div>
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
          <DataTable columns={createColumns(openDeleteModal)} data={projects} />
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
