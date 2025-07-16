import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const projectUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(55, "Title must be 55 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description must be 255 characters or less"),
  link: z.string().min(1, "Link is required").url("Please enter a valid URL"),
  technologies: z
    .string()
    .min(1, "Technologies are required")
    .max(200, "Technologies list is too long"),
  status: z.enum(["featured", "archived"]).default("featured"),
});

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const REVALIDATE_PATHS = [
  "/",
  "/admin/project",
  "/archive",
  "/project",
  "/api/project",
];

const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function getProjectIdFromUrl(url: string): string | null {
  return url.match(/\/api\/project\/(.+)$/)?.[1] || null;
}

function revalidateAllPaths(): void {
  REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
}

function extractFileNameFromUrl(url: string): string | null {
  const parts = url.split("/");
  const bucketIndex = parts.findIndex((part) => part === "project-preview");
  return bucketIndex !== -1
    ? parts.slice(bucketIndex + 1).join("/")
    : parts[parts.length - 1];
}

async function deleteImageFromStorage(imageUrl: string): Promise<void> {
  if (!supabase || !imageUrl) return;

  try {
    const fileName = extractFileNameFromUrl(imageUrl);
    if (fileName) {
      await supabase.storage.from("project-preview").remove([fileName]);
    }
  } catch (error) {
    console.error("Error deleting image from storage:", error);
  }
}

async function uploadImageToStorage(file: File): Promise<string> {
  if (!supabase) throw new Error("File upload service not configured");
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed");
  }
  if (file.size > MAX_FILE_SIZE)
    throw new Error("File too large. Maximum size is 5MB");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  await supabase.storage.from("project-preview").upload(fileName, file);
  return `${supabaseUrl}/storage/v1/object/public/project-preview/${fileName}`;
}

async function findProjectById(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error("Project not found");
  return project;
}

function createErrorResponse(error: unknown, defaultMessage: string) {
  const message = error instanceof Error ? error.message : defaultMessage;
  const status = message === "Project not found" ? 404 : 500;
  return NextResponse.json({ error: message }, { status });
}

export async function PUT(request: NextRequest) {
  try {
    const id = getProjectIdFromUrl(request.url);
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      link: formData.get("link") as string,
      technologies: formData.get("technologies") as string,
      status: formData.get("status") as string,
    };

    const validationResult = projectUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const existingProject = await findProjectById(id);
    let imageUrl = existingProject.preview;

    const preview = formData.get("preview") as File | null;
    if (preview && preview.size > 0) {
      if (imageUrl) await deleteImageFromStorage(imageUrl);
      imageUrl = await uploadImageToStorage(preview);
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        technologies: data.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: data.status as "featured" | "archived",
        preview: imageUrl,
      },
    });

    revalidateAllPaths();
    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Project update error:", error);
    return createErrorResponse(error, "Failed to update project");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = getProjectIdFromUrl(request.url);
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const existingProject = await findProjectById(id);
    if (existingProject.preview)
      await deleteImageFromStorage(existingProject.preview);

    const deletedProject = await prisma.project.delete({ where: { id } });
    revalidateAllPaths();

    return NextResponse.json({
      success: true,
      data: deletedProject,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Project delete error:", error);
    return createErrorResponse(error, "Failed to delete project");
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = getProjectIdFromUrl(request.url);
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await findProjectById(id);
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Project fetch error:", error);
    return createErrorResponse(error, "Failed to fetch project");
  }
}
