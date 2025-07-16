import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/prisma/client";
import { projectSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 1209600; // 2 weeks

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract and validate fields
    const projectData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      link: formData.get("link") as string,
      technologies: formData.get("technologies") as string,
      status: formData.get("status") as string,
    };

    const validationResult = projectSchema.safeParse(projectData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { title, description, link, technologies, status } =
      validationResult.data;
    const image = formData.get("image") as File | null;

    // Handle image upload
    let imageUrl = "";
    if (image?.size) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
          { status: 400 }
        );
      }

      if (image.size > maxSize) {
        return NextResponse.json(
          { error: "File too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }

      const fileExt = image.name.split(".").pop();
      const fileName = `project_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-preview")
        .upload(fileName, image);

      if (uploadError) {
        return NextResponse.json(
          { error: "Failed to upload image", details: uploadError.message },
          { status: 500 }
        );
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-preview/${fileName}`;
    }

    // Create project
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        link: link || "",
        technologies: technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: (status as "featured" | "archived") || "featured",
        preview: imageUrl || null,
      },
    });

    // Revalidate paths
    ["/", "/admin/project", "/archive", "/project", "/api/project"].forEach(
      (path) => revalidatePath(path)
    );

    return NextResponse.json({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
