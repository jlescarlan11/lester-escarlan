"use client";

import { useRouter } from "next/navigation";
import Breadcrumbs from "@/app/_components/common/Breadcrumbs";
import { ProjectForm } from "../_components/ProjectForm";

const CreateProjectPage = () => {
  const router = useRouter();

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
          <h1>Create Project</h1>
          <p className="text-muted-foreground">
            Add a new project to your portfolio
          </p>
        </header>
      </div>
      <ProjectForm
        mode="create"
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default CreateProjectPage;
