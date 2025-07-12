import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { prisma } from "@/prisma/client";
import { projectSchema } from "@/lib/schemas";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Extract fields
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const link = formData.get("link") as string | null;
    const technology = formData.get("technologies") as string | null;
    const status = formData.get("status") as string | null;
    const image = formData.get("image") as File | null;

    // Validate input using the shared schema, mapping technology field to technologies
    const validationResult = projectSchema.safeParse({
      title,
      description,
      link,
      technologies: technology,
      status,
    });
    if (!validationResult.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: validationResult.error.issues,
      }, { status: 400 });
    }

    // Parse technology into array
    const technologyArray = technology!.split(",").map(t => t.trim()).filter(Boolean);

    // Handle image upload if present
    let imageUrl = "";
    if (image && image.size > 0) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 });
      }
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (image.size > maxSize) {
        return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
      }
      // Upload to Supabase
      const fileExt = image.name.split(".").pop();
      const fileName = `project_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("project-preview")
        .upload(fileName, image);
      if (uploadError) {
        return NextResponse.json({ error: "Failed to upload image", details: uploadError.message }, { status: 500 });
      }
      imageUrl = `${supabaseUrl}/storage/v1/object/public/project-preview/${fileName}`;
    }

    // Create project in DB
    const newProject = await prisma.project.create({
      data: {
        title: title!,
        description: description!,
        link: link || "",
        technologies: technologyArray,
        status: (status as "featured" | "archived") || "featured",
        preview: imageUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create project",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
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
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}
