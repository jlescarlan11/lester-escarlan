"use client";

import SectionTitle from "@/app/_components/common/SectionTitle";
import { useRouter } from "next/navigation";
import { ProjectForm } from "../_components/ProjectForm";

const CreateProjectPage = () => {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/admin/project");
  };

  const handleSuccess = () => {
    // The form will handle the redirect and show success toast
  };

  return (
    <>
      <SectionTitle
        section="Create Project"
        description="Add a new project to your portfolio"
      />
      <ProjectForm
        mode="create"
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default CreateProjectPage;
