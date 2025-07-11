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
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import React, { useState } from "react";
import ImageCropper from "@/components/ui/ImageCropper";
import { useForm } from "react-hook-form";
import { LuImagePlus, LuX } from "react-icons/lu";
import { z } from "zod";

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

  function onSubmit(values: ProjectFormValues) {
    // Transform technologies string to array
    const technology = values.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      ...values,
      technology, // backend expects 'technology' array
      image: values.image, // use form value for image
    };
    console.log(payload);
    // TODO: send payload to backend
  }

  return (
    <div>
      <div>
        <Breadcrumbs />
      </div>
      <header>
        <h1>Create Project</h1>
      </header>
      <div>
        <div>
          <div className="grid grid-cols-2 gap-8 ">
            {/* Image Upload and Crop UI */}
            <div>
              <div>
                {/* Upload area: clickable, shows icon or cropped image */}
                <div>
                  <div
                    className="flex flex-col h-72 rounded-md border border-dashed border-muted-foreground bg-muted items-center justify-center cursor-pointer relative group"
                  >
                    {/* Show cropped image if exists */}
                    {croppedImage ? (
                      <>
                        <Image
                          src={croppedImage}
                          alt="Cropped"
                          width={0}
                          height={0}
                          className="rounded-md border w-auto h-72  object-cover "
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
                      </>
                    ) : (
                      <span className="flex flex-col gap-2 items-center justify-center w-full h-full text-muted-foreground">
                        <LuImagePlus className="w-8 h-8 " />
                        <Label className="font-semibold">
                          Upload image as cover
                        </Label>
                      </span>
                    )}
                  </div>
                </div>
                {/* Modal Cropper */}
                <ImageCropper
                  onCropComplete={(blob: Blob) => {
                    const url = URL.createObjectURL(blob);
                    setCroppedImage(url);
                    // Set the form value for image as well
                    projectForm.setValue('image', url);
                  }}
                  maxWidth={1200}
                  maxHeight={600}
                />
                {croppedImage && (
                  <div className="mt-4">
                    <Image src={croppedImage} alt="Cropped Preview" width={600} height={300} className="rounded-md border w-auto h-72 object-cover" />
                  </div>
                )}
              </div>
            </div>
            <Form {...projectForm}>
              <form
                onSubmit={projectForm.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                        Separate technologies with commas (e.g. Next.JS,
                        Typescript, PostgreSQL)
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
