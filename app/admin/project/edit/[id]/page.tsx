"use client";

import SectionTitle from "@/app/_components/common/SectionTitle";
import { useParams, useRouter } from "next/navigation";
import { ProjectForm } from "../../_components/ProjectForm";

const EditProjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const handleCancel = () => {
    router.push("/admin/project");
  };

  const handleSuccess = () => {
    // The form will handle the redirect and show success toast
  };

  return (
    <>
      <SectionTitle
        section="Edit Project"
        description="Update your project information"
      />

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
