import axios from "axios";

export default async function getProjectData() {
  try {
    const response = await axios.get("/api/project");
    let projectData = [];
    if (response.data.success) {
      projectData = response.data.data.filter((p: unknown): p is { status: string } => {
        return typeof p === "object" && p !== null && "status" in p && (p as { status: string }).status === "featured";
      });
    }
    return {
      section: "Projects",
      sectionDescription: "My personal projects and contributions.",
      projectData,
    };
  } catch {
    return {
      section: "Projects",
      sectionDescription: "My personal projects and contributions.",
      projectData: [],
    };
  }
}
