"use client"

import { useParams, useRouter } from "next/navigation"
import Breadcrumbs from "@/app/_components/common/Breadcrumbs"
import { ProjectForm } from "../../_components/ProjectForm"

const EditProjectPage = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const handleCancel = () => {
    router.push("/admin/project")
  }

  const handleSuccess = () => {
    // The form will handle the redirect
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <Breadcrumbs />
        <h1 className="text-3xl font-bold tracking-tight mt-2">Edit Project</h1>
        <p className="text-muted-foreground">
          Update your project information
        </p>
      </div>

      <ProjectForm
        mode="edit"
        projectId={projectId}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

export default EditProjectPage 