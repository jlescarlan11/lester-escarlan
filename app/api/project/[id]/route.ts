import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
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
  "/projects",
  "/api/project",
];

let supabase: SupabaseClient | null = null;
if (supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch {
    // Supabase client initialization failed
  }
}

function getProjectIdFromUrl(url: string): string | null {
  const match = url.match(/\/api\/project\/(.+)$/);
  return match?.[1] || null;
}

function revalidateAllPaths(): void {
  REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
}

function extractFileNameFromUrl(url: string): string | null {
  const urlParts = url.split("/");
  const bucketIndex = urlParts.findIndex((part) => part === "project-preview");
  return bucketIndex !== -1
    ? urlParts.slice(bucketIndex + 1).join("/")
    : urlParts[urlParts.length - 1];
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
  if (!supabase) {
    throw new Error("File upload service not configured");
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed");
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  await supabase.storage.from("project-preview").upload(fileName, file);
  return `${supabaseUrl}/storage/v1/object/public/project-preview/${fileName}`;
}

async function findProjectById(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
}

export async function PUT(request: NextRequest) {
  try {
    const id = getProjectIdFromUrl(request.url);
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string;
    const technologies = formData.get("technologies") as string;
    const status = formData.get("status") as string;
    const preview = formData.get("preview") as File | null;

    // Validate input
    const validationResult = projectUpdateSchema.safeParse({
      title,
      description,
      link,
      technologies,
      status,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
          message: "Please check the form fields and try again",
        },
        { status: 400 }
      );
    }

    const existingProject = await findProjectById(id);
    let imageUrl = existingProject.preview;

    // Handle image upload if provided
    if (preview && preview.size > 0) {
      try {
        // Delete old image first
        if (imageUrl) {
          await deleteImageFromStorage(imageUrl);
        }

        // Upload new image
        imageUrl = await uploadImageToStorage(preview);
      } catch (error) {
        return NextResponse.json(
          {
            error:
              error instanceof Error ? error.message : "Failed to upload image",
          },
          { status: 500 }
        );
      }
    }

    // Parse technologies
    const technologyArray = technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        link,
        technologies: technologyArray,
        status: status as "featured" | "archived",
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
    const message =
      error instanceof Error ? error.message : "Failed to update project";
    const status = message === "Project not found" ? 404 : 500;

    return NextResponse.json(
      {
        error: message,
        details: error instanceof Error ? error.message : String(error),
      },
      { status }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = getProjectIdFromUrl(request.url);
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const existingProject = await findProjectById(id);

    // Delete image from storage if it exists
    if (existingProject.preview) {
      await deleteImageFromStorage(existingProject.preview);
    }

    // Delete project from database
    const deletedProject = await prisma.project.delete({ where: { id } });

    revalidateAllPaths();

    return NextResponse.json({
      success: true,
      data: deletedProject,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Project delete error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete project";
    const status = message === "Project not found" ? 404 : 500;

    return NextResponse.json(
      {
        error: message,
        details: error instanceof Error ? error.message : String(error),
      },
      { status }
    );
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
    const message =
      error instanceof Error ? error.message : "Failed to fetch project";
    const status = message === "Project not found" ? 404 : 500;

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
