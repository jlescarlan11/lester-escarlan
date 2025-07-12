import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { prisma } from "@/prisma/client";
import { z } from "zod";

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

let supabase: SupabaseClient | null = null;
if (supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch {
    // console.error("Failed to initialize Supabase client");
  }
}

function getProjectIdFromUrl(url: string) {
  const match = url.match(/\/api\/project\/(.+)$/);
  return match ? match[1] : null;
}

export async function PUT(request: NextRequest) {
  try {
    const url = request.url;
    const id = getProjectIdFromUrl(url);
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

    // Check if project exists
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let imageUrl = existingProject.preview;

    // Upload new image if provided
    if (preview && preview.size > 0) {
      if (!supabase) {
        return NextResponse.json(
          { error: "File upload service not configured" },
          { status: 500 }
        );
      }
      // Delete old image if it exists
      if (imageUrl) {
        try {
          // Extract filename from the URL
          const urlParts = imageUrl.split("/");
          const bucketIndex = urlParts.findIndex(
            (part) => part === "project-preview"
          );
          const oldFileName =
            bucketIndex !== -1
              ? urlParts.slice(bucketIndex + 1).join("/")
              : urlParts[urlParts.length - 1];
          if (oldFileName) {
            await supabase.storage
              .from("project-preview")
              .remove([oldFileName]);
          }
        } catch {
          // console.error("Error deleting old image from storage:", storageError);
        }
      }
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(preview.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
          { status: 400 }
        );
      }
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (preview.size > maxSize) {
        return NextResponse.json(
          { error: "File too large. Maximum size is 5MB" },
          { status: 400 }
        );
      }
      try {
        const fileExt = preview.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        await supabase.storage
          .from("project-preview")
          .upload(fileName, preview);
        imageUrl = `${supabaseUrl}/storage/v1/object/public/project-preview/${fileName}`;
      } catch {
        // console.error("Exception during upload:", uploadException);
        return NextResponse.json(
          { error: "Failed to upload image" },
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

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update project",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = request.url;
    const id = getProjectIdFromUrl(url);
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }
    // Check if project exists
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    // Delete image from Supabase storage if it exists
    if (existingProject.preview && supabase) {
      try {
        // Extract filename from the URL
        const urlParts = existingProject.preview.split("/");
        // Find the index of 'project-preview' in the URL
        const bucketIndex = urlParts.findIndex(
          (part) => part === "project-preview"
        );
        // The filename is everything after the bucket name
        const fileName =
          bucketIndex !== -1
            ? urlParts.slice(bucketIndex + 1).join("/")
            : urlParts[urlParts.length - 1];
        if (fileName) {
          const { error: deleteError } = await supabase.storage
            .from("project-preview")
            .remove([fileName]);
          if (deleteError) {
            console.error("Failed to delete image from storage:", deleteError);
          }
        }
      } catch (storageError) {
        console.error("Error deleting image from storage:", storageError);
      }
    }
    // Delete project
    const deletedProject = await prisma.project.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      data: deletedProject,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete project",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = request.url;
  const id = getProjectIdFromUrl(url);
  if (!id) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    const response = { success: true, data: project };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
} 