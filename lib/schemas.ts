import { z } from "zod";

// Shared project schema for both frontend and backend validation
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(55, "Title must be 55 characters or less"),
  description: z.string().min(1, "Description is required").max(255, "Description must be 255 characters or less"),
  link: z.string().url("Please enter a valid URL (e.g., https://example.com)").optional(),
  technologies: z.string().min(1, "At least one technology is required").max(200, "Technologies list is too long"),
  status: z.enum(["featured", "archived"]).optional(),
});

// Frontend form schema (includes image field for form handling)
export const projectFormSchema = projectSchema.extend({
  image: z.string().url("Must be a valid URL").optional(),
});

// Type exports
export type ProjectFormValues = z.infer<typeof projectFormSchema>; 