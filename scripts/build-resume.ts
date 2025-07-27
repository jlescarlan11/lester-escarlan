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
  technologies?: string[];
  location?: string;
  logo?: string;
}

interface ExperienceData {
  company: string;
  position: string;
  period: string;
  details: string[];
  technologies?: string[];
  location?: string;
  logo?: string;
}

// Technical Skills Categories - Comprehensive list of most used tech tools
const TECHNICAL_SKILLS_CATEGORIES = {
  languages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "C",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Dart",
    "Scala",
    "R",
    "MATLAB",
    "Shell/Bash",
    "PowerShell",
    "SQL",
    "GraphQL",
    "HTML",
    "CSS",
    "SCSS/Sass",
    "Less"
  ],
  frameworks: [
    // Frontend Frameworks/Libraries
    "React",
    "Angular",
    "Vue.js",
    "Svelte",
    "Next.js",
    "Nuxt.js",
    "Gatsby",
    "Remix",
    "SvelteKit",
    
    // Backend Frameworks
    "Node.js",
    "Express.js",
    "Nest.js",
    "Fastify",
    "Koa.js",
    "ASP.NET Core",
    "Spring Boot",
    "Django",
    "Flask",
    "FastAPI",
    "Laravel",
    "Symfony",
    "CodeIgniter",
    "Ruby on Rails",
    "Sinatra",
    "Gin",
    "Fiber",
    "Echo",
    
    // Mobile Frameworks
    "React Native",
    "Flutter",
    "Ionic",
    "Xamarin",
    "Cordova/PhoneGap",
    
    // CSS Frameworks/Libraries
    "Tailwind CSS",
    "Bootstrap",
    "Material-UI",
    "Ant Design",
    "Chakra UI",
    "Bulma",
    "Foundation",
    "Semantic UI",
    "Radix UI",
    "Mantine",
    "Styled Components",
    "Emotion",
    
    // State Management
    "Redux",
    "MobX",
    "Zustand",
    "Recoil",
    "Vuex",
    "Pinia",
    
    // Testing Frameworks
    "Jest",
    "Mocha",
    "Cypress",
    "Playwright",
    "Selenium",
    "JUnit",
    "PyTest",
    "PHPUnit",
    "RSpec"
  ],
  tools: [
    // Version Control
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "SVN",
    
    // IDEs/Editors
    "Visual Studio Code",
    "Visual Studio",
    "IntelliJ IDEA",
    "WebStorm",
    "PyCharm",
    "Eclipse",
    "Xcode",
    "Android Studio",
    "Sublime Text",
    "Vim",
    "Emacs",
    "Atom",
    
    // Containerization & Orchestration
    "Docker",
    "Kubernetes",
    "Docker Compose",
    "Podman",
    
    // Cloud Platforms
    "AWS",
    "Azure",
    "Google Cloud Platform",
    "DigitalOcean",
    "Heroku",
    "Vercel",
    "Netlify",
    "Railway",
    "Render",
    
    // Databases
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "SQL Server",
    "Oracle",
    "Cassandra",
    "DynamoDB",
    "Firebase",
    "Supabase",
    "PlanetScale",
    "Neon",
    
    // Database Tools/ORMs
    "Prisma",
    "TypeORM",
    "Sequelize",
    "Mongoose",
    "Eloquent",
    "Hibernate",
    "SQLAlchemy",
    "Knex.js",
    "Drizzle",
    
    // API Testing & Development
    "Postman",
    "Insomnia",
    "Thunder Client",
    "Swagger/OpenAPI",
    "GraphQL Playground",
    "Apollo Studio",
    
    // Build Tools & Bundlers
    "Webpack",
    "Vite",
    "Parcel",
    "Rollup",
    "esbuild",
    "Turbopack",
    "Gulp",
    "Grunt",
    
    // Package Managers
    "npm",
    "Yarn",
    "pnpm",
    "pip",
    "Maven",
    "Gradle",
    "Composer",
    "NuGet",
    "Cargo",
    
    // CI/CD
    "GitHub Actions",
    "GitLab CI",
    "Jenkins",
    "CircleCI",
    "Travis CI",
    "Azure DevOps",
    "TeamCity",
    
    // Monitoring & Analytics
    "Sentry",
    "LogRocket",
    "New Relic",
    "Datadog",
    "Prometheus",
    "Grafana",
    "Google Analytics",
    "Mixpanel",
    
    // Design Tools
    "Figma",
    "Adobe XD",
    "Sketch",
    "InVision",
    "Canva",
    "Adobe Photoshop",
    "Adobe Illustrator",
    
    // Communication & Project Management
    "Slack",
    "Discord",
    "Microsoft Teams",
    "Jira",
    "Trello",
    "Asana",
    "Notion",
    "Linear",
    "Monday.com",
    
    // Development Environments
    "WSL",
    "VMware",
    "VirtualBox",
    "Vagrant",
    
    // Terminal/Command Line Tools
    "iTerm2",
    "Windows Terminal",
    "Hyper",
    "Oh My Zsh",
    "Powerlevel10k",
    
    // Authentication & Security
    "Auth0",
    "Firebase Auth",
    "Supabase Auth",
    "Okta",
    "Keycloak",
    "JWT",
    "OAuth",
    
    // CMS & Headless CMS
    "Strapi",
    "Contentful",
    "Sanity",
    "Ghost",
    "WordPress",
    "Drupal",
    "Directus",
    
    // E-commerce
    "Shopify",
    "WooCommerce",
    "Magento",
    "Stripe",
    "PayPal",
    
    // Real-time Communication
    "Socket.io",
    "WebRTC",
    "Pusher",
    "Ably",
    
    // Search Engines
    "Elasticsearch",
    "Solr",
    "Algolia",
    "MeiliSearch",
    
    // Message Queues
    "RabbitMQ",
    "Apache Kafka",
    "Amazon SQS",
    "Bull Queue",
    
    // Documentation
    "GitBook",
    "Notion",
    "Confluence",
    "Docusaurus",
    "VuePress",
    "Storybook"
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

// UPDATED: Format education with new layout
const formatEducation = (edu: EducationData): string => {
  const technologies = edu.technologies && edu.technologies.length > 0 
    ? ` | ${edu.technologies.map(escapeLatex).join(", ")}` 
    : '';
  const location = edu.location ? escapeLatex(edu.location) : '';
  
  return `
    \\begin{twocolentry}{\\textbf{${escapeLatex(edu.period)}}}
    \\textbf{${escapeLatex(edu.degree)}}\\textit{${technologies}}\\end{twocolentry}
    \\vspace{0.05cm}
    \\begin{twocolentry}{${location}}
    ${escapeLatex(edu.institution)}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        \\begin{highlights}
${edu.details.map((d: string) => `            \\item ${escapeLatex(d)}`).join("\n")}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;
};

// UPDATED: Format experience with new layout
const formatExperience = (exp: ExperienceData): string => {
  const technologies = exp.technologies && exp.technologies.length > 0
    ? ` | ${exp.technologies.map(escapeLatex).join(", ")}`
    : '';
  const location = exp.location ? escapeLatex(exp.location) : '';
  
  return `
    \\begin{twocolentry}{\\textbf{${escapeLatex(exp.period)}}}
    \\textbf{${escapeLatex(exp.position)}}\\textit{${technologies}}\\end{twocolentry}
    \\vspace{0.05cm}
    \\begin{twocolentry}{${location}}
    ${escapeLatex(exp.company)}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        \\begin{highlights}
${exp.details.map((d: string) => `            \\item ${escapeLatex(d)}`).join("\n")}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;
};

// UPDATED: Format projects with simplified layout
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

  const projectTitle = `\\textbf{${escapeLatex(proj.title)}}`;

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

  return `    \\begin{twocolentry}{\\textbf{${escapeLatex(dateString)}}}
        ${projectTitle} | \\textit{${techsString}}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        \\begin{highlights}
${descriptionBullets}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}`;
};

// UPDATED: Format tech categories - simplified to 3 categories only
const formatTechCategories = (categorized: Record<string, string[]>) => {
  const categoryLabels: Record<string, string> = {
    languages: "Languages",
    frameworks: "Frameworks/Libraries", 
    tools: "Tools"
  };

  // Only use the 3 specified categories
  const orderedCategories = ['languages', 'frameworks', 'tools'];
  
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
\\usepackage[ignoreheadfoot,top=1cm,bottom=1cm,left=1.5cm,right=1.5cm,footskip=1.0cm]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 0, 0}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[pdftitle={${escapeLatex(header.name)} - Software Developer},pdfauthor={${escapeLatex(header.name)}},pdfcreator={LaTeX with ResumeBuilder},colorlinks=true,colorlinks=true,urlcolor=blue,linkcolor=blue]{hyperref}
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
    
    % First line: Name on left, email and portfolio on right
    \\begin{tabularx}{\\textwidth}{@{}X r@{}}
        \\fontsize{20pt}{20pt}\\selectfont \\textbf{${escapeLatex(header.name)}} & 
        \\fontsize{10pt}{10pt}\\selectfont 
        Email: \\textcolor{blue}{\\underline{\\hrefWithoutArrow{mailto:${escapeLatex(contact.contactInfo.email)}}{${escapeLatex(contact.contactInfo.email)}}}} \\quad
        Portfolio: \\textcolor{blue}{\\underline{\\hrefWithoutArrow{https://lester-escarlan.vercel.app/}{lester-escarlan.vercel.app}}}
    \\end{tabularx}
    
    \\vspace{2pt}
    
    % Second line: Address on left, github and linkedin on right
    \\begin{tabularx}{\\textwidth}{@{}X r@{}}
        \\fontsize{10pt}{10pt}\\selectfont ${escapeLatex(contact.contactInfo.address)} & 
        \\fontsize{10pt}{10pt}\\selectfont
        GitHub: \\textcolor{blue}{\\underline{\\hrefWithoutArrow{http://${escapeLatex(contact.contactInfo.github)}}{${escapeLatex(contact.contactInfo.github)}}}} \\quad
        Linkedin: \\textcolor{blue}{\\underline{\\hrefWithoutArrow{http://www.${escapeLatex(contact.contactInfo.linkedin)}}{${escapeLatex(contact.contactInfo.linkedin)}}}}
    \\end{tabularx}
\\end{header}
\\vspace{5pt-0.3cm}
\\small

${formatSummary(professionalSummary)}

\\section{Technical Skills}
\\begin{onecolentry}
${formatTechCategories(categorizedTechs)}
\\end{onecolentry}

\\section{Education}
${education.educationData.map(formatEducation).join("\n")}

\\section{Experience}
${experience.experienceData.map(formatExperience).join("\n")}

\\section{Projects}
${projects.length === 0 ? "No projects found or server not running." : projects.map(formatProject).join("\n")}
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