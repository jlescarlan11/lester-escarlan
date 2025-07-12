"use client";
import Breadcrumbs from "@/app/_components/common/Breadcrumbs";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import ImageCropper from "@/components/ui/ImageCropper";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().url("Must be a valid URL").optional(),
  image: z.string().url("Must be a valid URL").optional(),
  technologies: z.string().min(1, "At least one technology is required"),
  status: z.enum(["featured", "archived"]).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const CreateProjectPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const projectForm = useForm<ProjectFormValues>({
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

  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  async function onSubmit(values: ProjectFormValues) {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      if (values.link) {
        formData.append("link", values.link);
      }
      formData.append("technology", values.technologies);
      formData.append("status", values.status || "featured");
      
      // If we have a cropped image, convert it to a File and append to formData
      if (croppedImage) {
        // Convert base64/blob URL to File
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const file = new File([blob], "project-image.jpg", { type: "image/jpeg" });
        formData.append("image", file);
      }

      const response = await axios.post("/api/project", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Redirect to projects list or show success message
        router.push("/admin/project");
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      setError(error.response?.data?.error || "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Breadcrumbs />
      <header>
        <h1>Create Project</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Upload and Crop UI */}
        <div>
          {croppedImage ? (
            <div className="flex flex-col h-72 rounded-md border border-dashed border-muted-foreground bg-muted items-center justify-center cursor-pointer relative group">
              <Image
                src={croppedImage}
                alt="Cropped"
                width={0}
                height={0}
                className="rounded-md border w-auto h-72 object-cover"
              />
              <Button
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  setCroppedImage(null);
                }}
                className="absolute -top-3 -right-3 z-10 border border-muted-foreground rounded-full w-7 h-7 flex items-center justify-center shadow transition-colors"
              >
                <LuX />
              </Button>
            </div>
          ) : (
            <ImageCropper
              onCropComplete={(blob: Blob) => {
                const url = URL.createObjectURL(blob);
                setCroppedImage(url);
                projectForm.setValue("image", url);
              }}
            />
          )}
        </div>

        <Form {...projectForm}>
          <form
            onSubmit={projectForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {error && (
              <div className="p-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <FormField
              control={projectForm.control}
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
              control={projectForm.control}
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
              control={projectForm.control}
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
              control={projectForm.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, TypeScript, Node.js"
                      {...field}
                    />
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
              control={projectForm.control}
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
                onClick={() => router.push("/admin/project")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
