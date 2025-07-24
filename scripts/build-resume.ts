import fs from "fs";
import path from "path";
import latex from "node-latex";
import axios from "axios";
import techStack from "../app/_data/techStack";
import education from "../app/_data/education";
import experience from "../app/_data/experience";
import header from "../app/_data/header";
import contact from "../app/_data/contact";

// Type definitions
interface ProjectData {
  title: string;
  description: string;
  technologies: string[] | string;
  link?: string;
  createdAt?: string;
  status: string;
}

interface EducationData {
  institution: string;
  degree: string;
  period: string;
  gwa?: string;
  details: string[];
}

interface ExperienceData {
  company: string;
  position: string;
  period: string;
  details: string[];
}

// Technical Skills Categories - Focused and Realistic for Junior Developer
const TECHNICAL_SKILLS_CATEGORIES = {
  languages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++", 
    "SQL",
    "GraphQL",
    "HTML",
    "CSS",
  ],
  frameworks: [
    "ASP.NET Core",
    "Next.js",
    "React",
    "Node.js",
    "Laravel",
    "Express.js",
  ],
  tools: [
    "Git",
    "Visual Studio Code",
    "Postman",
    "Vite",
    "Figma",
    "IntelliJ IDEA",
    "Docker",
  ],
  databases: [
    "Supabase",
    "Prisma",
    "SQL Server"
  ],
  libraries: [
    "Tailwind CSS",
    "Bootstrap",
    "Radix UI",
    "Material-UI"
  ]
};

// Utility functions
const escapeLatex = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/"/g, "''")
    .replace(/'/g, "'");
};

const sortTechs = (techs: string[]): string[] =>
  techs.sort((a, b) => a.localeCompare(b));

const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    const response = await axios.get("http://localhost:3000/api/project");
    return response.data.success && Array.isArray(response.data.data)
      ? response.data.data.filter((p: ProjectData) => p.status === "featured")
      : [];
  } catch {
    console.warn(
      "Warning: Could not fetch projects. Is your dev server running?"
    );
    return [];
  }
};

const categorizeUserTechs = (userTechs: string[]) => {
  const categorized: Record<string, string[]> = {};

  Object.entries(TECHNICAL_SKILLS_CATEGORIES).forEach(([category, techs]) => {
    const matching = userTechs.filter((tech) => techs.includes(tech));
    if (matching.length > 0) {
      categorized[category] = sortTechs(matching);
    }
  });

  return categorized;
};

// NEW: Format professional summary
const formatSummary = (summary: string) => `
\\section{Summary}
\\begin{onecolentry}
    
    ${escapeLatex(summary)}
\\end{onecolentry}
\\vspace{0.15cm}`;

// UPDATED: Format education with gwa placeholder
const formatEducation = (edu: EducationData): string => {
  const gwaLine = edu.gwa ? `GWA: ${escapeLatex(edu.gwa)}` : `GWA: [Add if 3.0 or higher]`;
  
  return `
    \\begin{twocolentry}{${escapeLatex(edu.period)}}
    \\textbf{${escapeLatex(edu.institution)}} | ${escapeLatex(edu.degree)}\\\\
    ${gwaLine}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        
        \\begin{highlights}
${edu.details.map((d: string) => `            \\item ${escapeLatex(d)}`).join("\n")}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;
};

// UPDATED: Format experience with better structure
const formatExperience = (exp: ExperienceData): string => `
    \\begin{twocolentry}{${escapeLatex(exp.period)}}
    \\textbf{${escapeLatex(exp.company)}} | ${escapeLatex(exp.position)}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        
    \\begin{highlights}
    ${exp.details.map((d: string) => `            \\item ${escapeLatex(d)}`).join("\n")}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;

// UPDATED: Format projects with better tech display
const formatProject = (proj: ProjectData): string => {
  let dateString = "";
  if (proj.createdAt) {
    try {
      const date = new Date(proj.createdAt);
      if (!isNaN(date.getTime())) {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "long",
        };
        dateString = date.toLocaleDateString("en-US", options);
      }
    } catch {
      // Silent catch for invalid dates
    }
  }

  const techsString = Array.isArray(proj.technologies)
    ? proj.technologies.map(escapeLatex).join(", ")
    : escapeLatex(proj.technologies || "");

  const projectTitle = proj.link
    ? `\\textbf{\\underline{\\href{${escapeLatex(proj.link)}}{${escapeLatex(proj.title)}}}}`
    : `\\textbf{${escapeLatex(proj.title)}}`;

  // Enhanced description formatting with metric placeholders
  const descriptionBullets = proj.description
    ? proj.description
        .split(".")
        .map((sentence: string) => sentence.trim())
        .filter((sentence: string) => sentence.length > 0)
        .map((sentence: string) => {
          return `            \\item ${escapeLatex(sentence)}`;
        })
        .join("\n")
    : `            \\item ${escapeLatex(proj.description || "")}`;

  return `    \\begin{twocolentry}{${escapeLatex(dateString)}}
        ${projectTitle} | \\textit{${techsString}}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        
        \\begin{highlights}
${descriptionBullets}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;
};

// UPDATED: Format tech categories with better organization
const formatTechCategories = (categorized: Record<string, string[]>) => {
  const categoryLabels: Record<string, string> = {
    languages: "Languages",
    frameworks: "Frameworks", 
    tools: "Tools",
    databases: "Databases",
    libraries: "UI Libraries"
  };

  // Ensure consistent order
  const orderedCategories = ['languages', 'frameworks', 'tools', 'databases', 'libraries'];
  
  return orderedCategories
    .filter(category => categorized[category] && categorized[category].length > 0)
    .map(category => {
      const label = categoryLabels[category] || escapeLatex(category);
      return `    \\textbf{${label}:} ${categorized[category].map(escapeLatex).join(", ")} \\\\\n    \\vspace{0.05cm}\n`;
    })
    .join("") || "    No technical skills found.\\\\\n";
};

// UPDATED: Main LaTeX template with professional summary
const generateLatexContent = (
  projects: ProjectData[],
  categorizedTechs: Record<string, string[]>,
  professionalSummary: string = `${header.description}`
): string => `
% Resume generated by build-resume.ts - Professional Format

\\documentclass[10pt, letterpaper]{article}
\\usepackage[ignoreheadfoot,top=1cm,bottom=1cm,left=1cm,right=1cm,footskip=1.0cm]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 0, 0}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[pdftitle={${escapeLatex(header.name)} - Software Developer},pdfauthor={${escapeLatex(header.name)}},pdfcreator={LaTeX with ResumeBuilder},colorlinks=true,urlcolor=primaryColor]{hyperref}
\\usepackage[pscoord]{eso-pic}
\\usepackage{calc}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{ifthen}
\\usepackage{needspace}
\\usepackage{iftex}
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi
\\usepackage{charter}
\\raggedright
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt}
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0.15cm}
\\pagenumbering{gobble}
\\titleformat{\\section}{\\needspace{4\\baselineskip}\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule]
\\titlespacing{\\section}{-1pt}{0.3cm}{0.2cm}
\\renewcommand\\labelitemi{$\\vcenter{\\hbox{$\\bullet$}}$}
\\newenvironment{highlights}{\\begin{itemize}[topsep=0.10cm,parsep=0.10cm,partopsep=0pt,itemsep=0pt,leftmargin=0cm+10pt]}{\\end{itemize}}
\\newenvironment{highlightsforbulletentries}{\\begin{itemize}[topsep=0.10cm,parsep=0.10cm,partopsep=0pt,itemsep=0pt,leftmargin=10pt]}{\\end{itemize}}
\\newenvironment{onecolentry}{\\begin{adjustwidth}{0cm+0.00001cm}{0cm+0.00001cm}}{\\end{adjustwidth}}
\\newenvironment{twocolentry}[2][]{\\onecolentry\\def\\secondColumn{#2}\\setcolumnwidth{\\fill,5cm}\\begin{paracol}{2}}{\\switchcolumn \\raggedleft \\secondColumn\\end{paracol}\\endonecolentry}
\\newenvironment{threecolentry}[3][]{\\onecolentry\\def\\thirdColumn{#3}\\setcolumnwidth{,\\fill,4.5cm}\\begin{paracol}{3}{\\raggedright #2}\\switchcolumn}{\\switchcolumn \\raggedleft \\thirdColumn\\end{paracol}\\endonecolentry}
\\newenvironment{header}{\\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}}{\\par\\kern\\topsep}
\\let\\hrefWithoutArrow\\href
\\begin{document}
\\begin{header}
    \\fontsize{25pt}{25pt}\\selectfont \\textbf{${escapeLatex(header.name)}}
    \\vspace{3pt}
    \\\\ \\fontsize{12pt}{12pt}\\selectfont \\textbf{${escapeLatex(header.role)}}
    \\vspace{5pt}
    \\normalsize
    \\mbox{${escapeLatex(contact.contactInfo.address)} \\kern 5.0pt | \\kern 5.0pt 
      \\underline{\\hrefWithoutArrow{mailto:${escapeLatex(contact.contactInfo.email)}}{${escapeLatex(contact.contactInfo.email)}}} \\kern 5.0pt | \\kern 5.0pt 
      \\underline{\\hrefWithoutArrow{tel:${escapeLatex(contact.contactInfo.phone)}}{${escapeLatex(contact.contactInfo.phone)}}} \\kern 5.0pt | \\kern 5.0pt 
      \\underline{\\hrefWithoutArrow{${escapeLatex(contact.contactInfo.github)}}{GitHub}} \\kern 5.0pt | \\kern 5.0pt 
      \\underline{\\hrefWithoutArrow{${escapeLatex(contact.contactInfo.linkedin)}}{LinkedIn}} \\kern 5.0pt | \\kern 5.0pt 
      \\underline{\\hrefWithoutArrow{https://lester-escarlan.vercel.app/}{Portfolio}}}
\\end{header}
\\vspace{5pt-0.3cm}
\\small

${formatSummary(professionalSummary)}

\\section{Education}
${education.educationData.map(formatEducation).join("\n")}

\\section{Experience}
${experience.experienceData.map(formatExperience).join("\n")}

\\section{Projects}
${projects.length === 0 ? "No projects found or server not running." : projects.map(formatProject).join("\n")}

\\section{Technical Skills}
\\begin{onecolentry}
${formatTechCategories(categorizedTechs)}
\\end{onecolentry}
\\end{document}
`;

// Main execution
(async () => {
  const projects = await fetchProjects();
  const categorizedTechs = categorizeUserTechs(techStack.techs);
  const latexContent = generateLatexContent(projects, categorizedTechs);

  const outputDir = path.join(__dirname, "../public");
  const texPath = path.join(outputDir, "resume.tex");
  const pdfPath = path.join(outputDir, "john_lester_escarlan_resume.pdf");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(texPath, latexContent);

  const output = fs.createWriteStream(pdfPath);
  const pdf = latex(latexContent);

  pdf.pipe(output);
  pdf.on("error", (err: Error) => {
    console.error("LaTeX build error:", err);
    process.exit(1);
  });
  pdf.on("finish", () => {
    console.log(
      "Professional resume PDF generated at public/john_lester_escarlan_resume.pdf"
    );
  });
})();