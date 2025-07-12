"use client";

import { useParams, useRouter } from "next/navigation";
import Breadcrumbs from "@/app/_components/common/Breadcrumbs";
import { ProjectForm } from "../../_components/ProjectForm";

const EditProjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const handleCancel = () => {
    router.push("/admin/project");
  };

  const handleSuccess = () => {
    // The form will handle the redirect
  };

  return (
    <>
      <div>
        <Breadcrumbs />
        <header>
          <h1>Edit Project</h1>
          <p className="text-muted-foreground">
            Update your project information
          </p>
        </header>
      </div>

      <ProjectForm
        mode="edit"
        projectId={projectId}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default EditProjectPage;
