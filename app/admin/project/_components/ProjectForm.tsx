"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { LuX } from "react-icons/lu";
import ImageCropper from "@/components/ui/ImageCropper";
import { projectFormSchema, type ProjectFormValues } from "@/lib/schemas";
import { Project } from "@/app/_components/common/ProjectCardList";

interface ProjectFormProps {
  mode: "create" | "edit";
  projectId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ProjectForm({
  mode,
  projectId,
  onCancel,
  onSuccess,
}: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      image: "",
      technologies: "",
      status: "featured",
    },
  });

  const isEditMode = mode === "edit";

  // Fetch project data for edit mode
  useEffect(() => {
    if (!isEditMode || !projectId) return;

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/project/${projectId}`);

        if (data.success) {
          const projectData = data.data;
          setProject(projectData);

          form.reset({
            title: projectData.title,
            description: projectData.description,
            link: projectData.link,
            image: projectData.preview || "",
            technologies: projectData.technologies.join(", "),
            status: projectData.status,
          });

          if (projectData.preview) {
            setCroppedImage(projectData.preview);
          }
        } else {
          setError("Failed to load project data");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [isEditMode, projectId, form]);

  const handleImageCrop = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setCroppedImage(url);
    form.setValue("image", url);
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCroppedImage(null);
    form.setValue("image", "");
  };

  async function onSubmit(values: ProjectFormValues) {
    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("link", values.link || "");
      formData.append("technologies", values.technologies);
      formData.append("status", values.status || "featured");

      // Handle image upload if there's a new cropped image
      if (croppedImage && croppedImage !== project?.preview) {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const file = new File([blob], "project-image.jpg", {
          type: "image/jpeg",
        });
        formData.append(isEditMode ? "preview" : "image", file);
      }

      const url = isEditMode ? `/api/project/${projectId}` : "/api/project";
      const method = isEditMode ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const successMessage = isEditMode
          ? "Project updated successfully!"
          : "Project created successfully!";

        toast.success(successMessage);
        onSuccess();
        router.push("/admin/project");
      }
    } catch (error: unknown) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} project:`,
        error
      );
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${mode} project. Please try again.`;

      setError(errorMessage);
      toast.error(
        isEditMode
          ? "Failed to update project. Please try again."
          : "Failed to create project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Upload Section */}
      <div>
        {croppedImage ? (
          <div className="flex flex-col w-full aspect-square rounded-md border border-dashed border-muted-foreground bg-muted items-center justify-center cursor-pointer relative group">
            <Image
              src={croppedImage}
              alt="Project preview"
              width={0}
              height={0}
              className="rounded-md border w-full h-full object-cover"
              unoptimized
            />
            <Button
              variant="default"
              onClick={handleImageRemove}
              className="absolute -top-3 -right-3 z-10 border border-muted-foreground rounded-full w-7 h-7 flex items-center justify-center shadow transition-colors"
            >
              <LuX />
            </Button>
          </div>
        ) : (
          <ImageCropper onCropComplete={handleImageCrop} />
        )}
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="Project Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies</FormLabel>
                <FormControl>
                  <Input placeholder="React, TypeScript, Node.js" {...field} />
                </FormControl>
                <FormDescription>
                  Separate technologies with commas (e.g. Next.JS, Typescript,
                  PostgreSQL)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Project"
                  : "Create Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
