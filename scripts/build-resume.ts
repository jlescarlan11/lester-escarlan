import fs from "fs";
import path from "path";
import latex from "node-latex";
import axios from "axios";
import techStack from "../app/_data/techStack";

// Import data modules
const aboutModule = require("../app/_data/about").default;
const about = {
  aboutMe: aboutModule.aboutMe,
  techStack: aboutModule.techStack,
};
import education from "../app/_data/education";
import experience from "../app/_data/experience";
import header from "../app/_data/header";
import contact from "../app/_data/contact";

// Technical Skills Categories - Focused on Popular/Famous Technologies
const TECHNICAL_SKILLS_CATEGORIES = {
  languages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Dart",
    "SQL",
    "GraphQL",
    "HTML",
    "CSS",
  ],
  frameworks: [
    "Vue.js",
    "Angular",
    "Svelte",
    "Next.js",
    "Nuxt.js",
    "Node.js",
    "Express.js",
    "NestJS",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "ASP.NET Core",
    "Laravel",
    "Ruby on Rails",
    "React Native",
    "Flutter",
    "TensorFlow",
    "PyTorch",
    "Unity",
  ],
  tools: [
    "Git",
    "Visual Studio Code",
    "IntelliJ IDEA",
    "Docker",
    "Kubernetes",
    "Webpack",
    "Vite",
    "Jenkins",
    "Terraform",
    "AWS",
    "Azure",
    "Google Cloud",
    "Jest",
    "Cypress",
    "Selenium",
    "Postman",
    "Figma",
    "Jira",
    "Notion",
  ],
  libraries: [
    "React",
    "Redux",
    "Tailwind CSS",
    "Bootstrap",
    "Material-UI",
    "Styled Components",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Axios",
    "Socket.io",
    "Three.js",
    "D3.js",
    "Chart.js",
    "Lodash",
    "Moment.js",
    "jQuery",
    "Prisma",
    "Mongoose",
    "Sequelize",
  ],
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

const fetchProjects = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/project");
    return response.data.success && Array.isArray(response.data.data)
      ? response.data.data.filter((p: any) => p.status === "featured")
      : [];
  } catch (err) {
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

const formatEducation = (edu: any) => `
    \\begin{twocolentry}{${escapeLatex(edu.period)}}
        \\textbf{${escapeLatex(edu.institution)}}, ${escapeLatex(edu.degree)}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        \\begin{highlights}
${edu.details.map((d: string) => `            \\item ${escapeLatex(d)}`).join("\n")}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;

const formatExperience = (exp: any) => `
    \\begin{twocolentry}{${escapeLatex(exp.period)}}
        \\textbf{${escapeLatex(exp.company)}}, ${escapeLatex(exp.position)}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        \\begin{highlights}
${exp.details.map((d: string) => `            \\item ${escapeLatex(d)}`).join("\n")}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;

const formatProject = (proj: any) => {
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
    } catch (e) {
      // Silent catch for invalid dates
    }
  }

  const techsString = Array.isArray(proj.technologies)
    ? proj.technologies.map(escapeLatex).join(", ")
    : escapeLatex(proj.technologies || "");

  const projectTitle = proj.link
    ? `\\textbf{\\underline{\\href{${escapeLatex(proj.link)}}{${escapeLatex(proj.title)}}}}`
    : `\\textbf{${escapeLatex(proj.title)}}`;

  // Split description by periods and create bullet points
  const descriptionBullets = proj.description
    ? proj.description
        .split(".")
        .map((sentence: string) => sentence.trim())
        .filter((sentence: string) => sentence.length > 0)
        .map(
          (sentence: string) => `            \\item ${escapeLatex(sentence)}.`
        )
        .join("\n")
    : `            \\item ${escapeLatex(proj.description || "")}`;

  return `    \\begin{twocolentry}{${escapeLatex(dateString)}}
        ${projectTitle} | ${techsString}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        \\begin{highlights}
${descriptionBullets}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;
};

const formatTechCategories = (categorized: Record<string, string[]>) => {
  const categoryLabels: Record<string, string> = {
    languages: "Programming Languages",
    frameworks: "Frameworks",
    tools: "Developer Tools",
    libraries: "Libraries",
  };

  return (
    Object.entries(categorized)
      .map(([category, techs]) => {
        const label = categoryLabels[category] || escapeLatex(category);
        return `    \\textbf{${label}:} ${techs.map(escapeLatex).join(", ")} \\\\\n    \\vspace{0.10cm}\n`;
      })
      .join("") || "    No technical skills found.\\\\\n"
  );
};

const generateLatexContent = (
  projects: any[],
  categorizedTechs: Record<string, string[]>
) => `
% Resume generated by build-resume.ts

\\documentclass[10pt, letterpaper]{article}
\\usepackage[ignoreheadfoot,top=2cm,bottom=2cm,left=2cm,right=2cm,footskip=1.0cm]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 0, 0}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[pdftitle={${escapeLatex(header.name)}'s CV},pdfauthor={${escapeLatex(header.name)}},pdfcreator={LaTeX with ResumeBuilder},colorlinks=true,urlcolor=primaryColor]{hyperref}
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
\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}
\\newenvironment{highlights}{\\begin{itemize}[topsep=0.10cm,parsep=0.10cm,partopsep=0pt,itemsep=0pt,leftmargin=0cm+10pt]}{\\end{itemize}}
\\newenvironment{highlightsforbulletentries}{\\begin{itemize}[topsep=0.10cm,parsep=0.10cm,partopsep=0pt,itemsep=0pt,leftmargin=10pt]}{\\end{itemize}}
\\newenvironment{onecolentry}{\\begin{adjustwidth}{0cm+0.00001cm}{0cm+0.00001cm}}{\\end{adjustwidth}}
\\newenvironment{twocolentry}[2][]{\\onecolentry\\def\\secondColumn{#2}\\setcolumnwidth{\\fill,5cm}\\begin{paracol}{2}}{\\switchcolumn \\raggedleft \\secondColumn\\end{paracol}\\endonecolentry}
\\newenvironment{threecolentry}[3][]{\\onecolentry\\def\\thirdColumn{#3}\\setcolumnwidth{,\\fill,4.5cm}\\begin{paracol}{3}{\\raggedright #2}\\switchcolumn}{\\switchcolumn \\raggedleft \\thirdColumn\\end{paracol}\\endonecolentry}
\\newenvironment{header}{\\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}}{\\par\\kern\\topsep}
\\let\\hrefWithoutArrow\\href
\\begin{document}
\\begin{header}
    \\fontsize{25pt}{25pt}\\selectfont ${escapeLatex(header.name)}
    \\vspace{5pt}
    \\normalsize
    \\mbox{${escapeLatex(contact.contactInfo.address)} \\kern 5.0pt | \\kern 5.0pt 
      \\hrefWithoutArrow{mailto:${escapeLatex(contact.contactInfo.email)}}{${escapeLatex(contact.contactInfo.email)}} \\kern 5.0pt | \\kern 5.0pt 
      \\hrefWithoutArrow{tel:${escapeLatex(contact.contactInfo.phone)}}{${escapeLatex(contact.contactInfo.phone)}} \\kern 5.0pt | \\kern 5.0pt 
      \\hrefWithoutArrow{${escapeLatex(contact.contactInfo.github)}}{GitHub} \\kern 5.0pt | \\kern 5.0pt 
      \\hrefWithoutArrow{${escapeLatex(contact.contactInfo.linkedin)}}{LinkedIn}}
\\end{header}
\\vspace{5pt-0.3cm}

\\section{Education}
${education.educationData.map(formatEducation).join("\n")}

\\section{Work Experience}
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
  pdf.on("error", (err: any) => {
    console.error("LaTeX build error:", err);
    process.exit(1);
  });
  pdf.on("finish", () => {
    console.log(
      "Resume PDF generated at public/john_lester_escarlan_resume.pdf"
    );
  });
})();
