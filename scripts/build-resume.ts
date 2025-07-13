import fs from "fs";
import path from "path";
import latex from "node-latex";
import axios from "axios";
import techStack from "../app/_data/techStack";

// Import data from app/_data
// Dynamically import about.ts and destructure only the needed fields to avoid image import
const aboutModule = require("../app/_data/about").default;
const about = {
  aboutMe: aboutModule.aboutMe,
  techStack: aboutModule.techStack,
};
import education from "../app/_data/education";
import experience from "../app/_data/experience";
import header from "../app/_data/header";
import contact from "../app/_data/contact";

// Helper to escape LaTeX special characters
function escapeLatex(str: string): string {
  return str.replace(/[&%$#_{}~^\\]/g, (match) => `\\${match}`);
}

async function fetchProjects() {
  try {
    const response = await axios.get("http://localhost:3000/api/project");
    if (response.data.success && Array.isArray(response.data.data)) {
      // Only include featured projects
      return response.data.data.filter((p: any) => p.status === "featured");
    }
    return [];
  } catch (err) {
    console.warn(
      "Warning: Could not fetch projects from /api/project. Is your dev server running?"
    );
    return [];
  }
}

(async () => {
  // Fetch projects
  const projects = await fetchProjects();

  // Programming Languages
  const languageTechs = [
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
    "Scala",
    "Clojure",
    "Dart",
    "R",
    "MATLAB",
    "Julia",
    "Perl",
    "Lua",
    "Crystal",
    "Elixir",
    "Erlang",
    "Haskell",
    "F#",
    "Objective-C",
    "Assembly",
    "COBOL",
    "Fortran",
    "Pascal",
    "Delphi",
    "VB.NET",
    "PowerShell",
    "Bash",
    "Zsh",
    "Fish",
    "SQL",
    "PL/SQL",
    "T-SQL",
    "NoSQL",
    "GraphQL",
    "Solidity",
    "VHDL",
    "Verilog",
  ];

  // Frontend Technologies
  const frontendTechs = [
    "React",
    "Vue.js",
    "Angular",
    "Svelte",
    "Next.js",
    "Nuxt.js",
    "Gatsby",
    "Remix",
    "SolidJS",
    "Alpine.js",
    "Lit",
    "Stencil",
    "Preact",
    "Qwik",
    "HTML",
    "CSS",
    "Sass",
    "Less",
    "Stylus",
    "PostCSS",
    "Tailwind CSS",
    "Bootstrap",
    "Bulma",
    "Material-UI",
    "Chakra UI",
    "Ant Design",
    "Semantic UI",
    "Foundation",
    "Materialize",
    "Styled Components",
    "Emotion",
    "CSS Modules",
    "Webpack",
    "Vite",
    "Parcel",
    "Rollup",
    "esbuild",
    "Turbo",
    "SWC",
    "Redux",
    "MobX",
    "Zustand",
    "Recoil",
    "Jotai",
    "Valtio",
    "Context API",
  ];

  // Backend Technologies
  const backendTechs = [
    "Node.js",
    "Express.js",
    "Fastify",
    "Koa.js",
    "Hapi.js",
    "NestJS",
    "Meteor",
    "Sails.js",
    "Adonis.js",
    "Deno",
    "Bun",
    "Django",
    "Flask",
    "FastAPI",
    "Tornado",
    "Pyramid",
    "Bottle",
    "Starlette",
    "Quart",
    "Sanic",
    "Spring Boot",
    "Spring Framework",
    "Micronaut",
    "Quarkus",
    "Play Framework",
    "Dropwizard",
    "Spark Java",
    "Vert.x",
    "ASP.NET",
    "ASP.NET Core",
    ".NET Framework",
    ".NET Core",
    ".NET 5+",
    "Blazor",
    "Entity Framework",
    "Dapper",
    "Laravel",
    "Symfony",
    "CodeIgniter",
    "Zend",
    "CakePHP",
    "Slim",
    "Phalcon",
    "Yii",
    "Laminas",
    "Ruby on Rails",
    "Sinatra",
    "Hanami",
    "Roda",
    "Grape",
    "Gin",
    "Echo",
    "Fiber",
    "Gorilla",
    "Beego",
    "Revel",
    "Buffalo",
    "Actix",
    "Rocket",
    "Warp",
    "Axum",
    "Tide",
    "Hyper",
  ];

  // Database Technologies
  const databaseTechs = [
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "MariaDB",
    "Oracle",
    "SQL Server",
    "DB2",
    "Sybase",
    "H2",
    "HSQLDB",
    "Firebird",
    "CockroachDB",
    "TiDB",
    "MongoDB",
    "Redis",
    "Cassandra",
    "Amazon DynamoDB",
    "CouchDB",
    "Neo4j",
    "ArangoDB",
    "OrientDB",
    "RavenDB",
    "RethinkDB",
    "FaunaDB",
    "InfluxDB",
    "TimescaleDB",
    "Prometheus",
    "Grafana",
    "OpenTSDB",
    "Elasticsearch",
    "Solr",
    "Algolia",
    "Amazon CloudSearch",
    "Sphinx",
    "Memcached",
    "Apache Ignite",
    "Hazelcast",
    "VoltDB",
  ];

  // Cloud & DevOps Technologies
  const cloudDevOpsTechs = [
    "AWS",
    "Microsoft Azure",
    "Google Cloud Platform",
    "IBM Cloud",
    "Oracle Cloud",
    "DigitalOcean",
    "Linode",
    "Vultr",
    "Heroku",
    "Netlify",
    "Vercel",
    "Railway",
    "Render",
    "Fly.io",
    "PlanetScale",
    "Supabase",
    "Docker",
    "Kubernetes",
    "Docker Compose",
    "Podman",
    "containerd",
    "OpenShift",
    "Rancher",
    "Nomad",
    "Docker Swarm",
    "Jenkins",
    "GitLab CI",
    "GitHub Actions",
    "Travis CI",
    "CircleCI",
    "Azure DevOps",
    "TeamCity",
    "Bamboo",
    "Drone",
    "Buildkite",
    "Terraform",
    "CloudFormation",
    "Ansible",
    "Puppet",
    "Chef",
    "SaltStack",
    "Pulumi",
    "CDK",
    "Bicep",
  ];

  // Tools & Development
  const toolsTechs = [
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "SVN",
    "Mercurial",
    "Perforce",
    "Visual Studio Code",
    "IntelliJ IDEA",
    "WebStorm",
    "PyCharm",
    "Eclipse",
    "Visual Studio",
    "Sublime Text",
    "Atom",
    "Vim",
    "Neovim",
    "Emacs",
    "npm",
    "yarn",
    "pnpm",
    "pip",
    "conda",
    "Maven",
    "Gradle",
    "NuGet",
    "Composer",
    "Bundler",
    "Cargo",
    "Go Modules",
    "CocoaPods",
    "Carthage",
    "Jest",
    "Mocha",
    "Cypress",
    "Selenium",
    "Playwright",
    "Puppeteer",
    "JUnit",
    "TestNG",
    "NUnit",
    "xUnit",
    "RSpec",
    "PyTest",
    "PHPUnit",
    "Postman",
    "Insomnia",
    "Swagger",
    "OpenAPI",
    "Figma",
    "Sketch",
    "Adobe XD",
    "Jira",
    "Trello",
    "Asana",
    "Monday.com",
    "Linear",
    "Notion",
    "Confluence",
  ];

  // Mobile Development
  const mobileTechs = [
    "React Native",
    "Flutter",
    "Ionic",
    "Cordova",
    "PhoneGap",
    "Xamarin",
    "NativeScript",
    "Capacitor",
    "Expo",
    "Android Studio",
    "Xcode",
    "Android SDK",
    "iOS SDK",
    "Unity",
    "Unreal Engine",
  ];

  // Data & Analytics
  const dataAnalyticsTechs = [
    "Apache Spark",
    "Apache Hadoop",
    "Apache Kafka",
    "Apache Storm",
    "Apache Flink",
    "Apache Beam",
    "Apache Airflow",
    "Luigi",
    "Prefect",
    "Dagster",
    "Apache NiFi",
    "Talend",
    "Pentaho",
    "Informatica",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Keras",
    "XGBoost",
    "LightGBM",
    "spaCy",
    "NLTK",
    "Hugging Face",
    "OpenAI API",
    "Tableau",
    "Power BI",
    "D3.js",
    "Chart.js",
    "Plotly",
    "Kibana",
    "Looker",
    "Qlik",
    "Apache Superset",
    "Jupyter",
    "Google Colab",
    "RStudio",
    "Anaconda",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
  ];

  // Security Technologies
  const securityTechs = [
    "OAuth",
    "JWT",
    "SAML",
    "OpenID Connect",
    "Auth0",
    "Okta",
    "Keycloak",
    "HashiCorp Vault",
    "Certbot",
    "Let's Encrypt",
    "SSL/TLS",
    "HTTPS",
    "OWASP",
    "Snyk",
    "SonarQube",
    "Veracode",
    "Checkmarx",
    "Burp Suite",
    "Nessus",
    "Nmap",
    "Metasploit",
    "Wireshark",
    "Kali Linux",
  ];

  // Helper to generate tech section line only if there are matching techs
  function generateTechLine(label: string, list: string[]) {
    const filteredTechs = list
      .filter((t) => about.techStack.techs.includes(t))
      .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
      .map(escapeLatex)
      .join(", ");

    return filteredTechs
      ? `    \\textbf{${label}:} \\\\\n    ${filteredTechs} \\\\\n    \\vspace{0.10cm}\n`
      : "";
  }

  // Define the popular techs (should match the icons grid)
  const popularTechs = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Material-UI",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Git",
    "GitHub",
    "Vercel",
    "Netlify",
    "AWS",
    "Docker",
    "Java",
    "C#",
    "PHP",
    "Laravel",
    "Redux",
    "Express.js",
    ".NET",
    "Spring",
    "Kotlin",
    "Go",
    "Django",
    "Flask",
    "Sass",
    "Webpack",
    "Yarn",
    "npm",
    "Jest",
    "C++",
    "C",
    "Ruby on Rails",
    "Ruby",
    "Android",
    "Apple",
    "Firebase",
    "GraphQL",
    "Linux",
    "Redis",
    "Oracle",
    "SQLite",
    "Figma",
    "Jira",
    "Heroku",
    "Google Cloud",
    "Kubernetes",
  ];

  // In the Technologies section, only show the intersection of techStack.techs and popularTechs
  const filteredPopularTechs = popularTechs.filter((t) =>
    techStack.techs.includes(t)
  );

  // In the Technologies section, group and sort techs
  function groupAndSortTechs(techs: string[]) {
    const frontend = techs
      .filter((t) => frontendTechs.includes(t))
      .sort((a, b) => a.localeCompare(b));
    const backend = techs
      .filter((t) => backendTechs.includes(t))
      .sort((a, b) => a.localeCompare(b));
    const database = techs
      .filter((t) => databaseTechs.includes(t))
      .sort((a, b) => a.localeCompare(b));
    // Others: not in frontend, backend, or database
    const others = techs
      .filter(
        (t) =>
          !frontendTechs.includes(t) &&
          !backendTechs.includes(t) &&
          !databaseTechs.includes(t)
      )
      .sort((a, b) => a.localeCompare(b));
    return { frontend, backend, database, others };
  }

  // Compose LaTeX content using the provided structure and imported data
  const groupedTechs = groupAndSortTechs(techStack.techs);
  const latexContent = `
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
\\newenvironment{twocolentry}[2][]{\\onecolentry\\def\\secondColumn{#2}\\setcolumnwidth{\\fill,8cm}\\begin{paracol}{2}}{\\switchcolumn \\raggedleft \\secondColumn\\end{paracol}\\endonecolentry}
\\newenvironment{threecolentry}[3][]{\\onecolentry\\def\\thirdColumn{#3}\\setcolumnwidth{,\\fill,4.5cm}\\begin{paracol}{3}{\\raggedright #2}\\switchcolumn}{\\switchcolumn \\raggedleft \\thirdColumn\\end{paracol}\\endonecolentry}
\\newenvironment{header}{\\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}}{\\par\\kern\\topsep}
\\let\\hrefWithoutArrow\\href
\\begin{document}
\\begin{header}
    \\fontsize{25pt}{25pt}\\selectfont ${escapeLatex(header.name)}
    \\vspace{5pt}
    \\normalsize
    % Contact details in one line
    \\mbox{${escapeLatex(contact.contactInfo.address)} \\kern 5.0pt | \\kern 5.0pt 
      \\hrefWithoutArrow{mailto:${escapeLatex(contact.contactInfo.email)}}{${escapeLatex(contact.contactInfo.email)}} \\kern 5.0pt | \\kern 5.0pt 
      \\hrefWithoutArrow{tel:${escapeLatex(contact.contactInfo.phone)}}{${escapeLatex(contact.contactInfo.phone)}} \\kern 5.0pt | \\kern 5.0pt 
      \\hrefWithoutArrow{${escapeLatex(contact.contactInfo.github)}}{GitHub} \\kern 5.0pt | \\kern 5.0pt 
      \\hrefWithoutArrow{${escapeLatex(contact.contactInfo.linkedin)}}{LinkedIn}}
\\end{header}
\\vspace{5pt-0.3cm}
\\section{About Me}
\\begin{onecolentry}
    \\begin{highlightsforbulletentries}
${about.aboutMe.map((item: string) => `        \\item ${escapeLatex(item)}`).join("\n")}
    \\end{highlightsforbulletentries}
\\end{onecolentry}
\\section{Education}
${education.educationData
  .map(
    (edu: any) => `    \\begin{twocolentry}{${escapeLatex(edu.period)}}
        \\textbf{${escapeLatex(edu.institution)}}, ${escapeLatex(edu.degree)}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        \\begin{highlights}
${edu.details.map((d: string) => `            \\item ${escapeLatex(d)}`).join("\n")}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}
`
  )
  .join("\n")}
\\section{Work Experience}
${experience.experienceData
  .map(
    (exp: any) => `    \\begin{twocolentry}{${escapeLatex(exp.period)}}
        \\textbf{${escapeLatex(exp.company)}}, ${escapeLatex(exp.position)}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
        \\begin{highlights}
${exp.details.map((d: string) => `            \\item ${escapeLatex(d)}`).join("\n")}
        \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}
`
  )
  .join("\n")}
\\section{Projects}
${
  projects.length === 0
    ? "No projects found or server not running."
    : projects
        // Only include featured projects (defensive, though fetchProjects already filters)
        .filter((proj: any) => proj.status === "featured")
        .map((proj: any) => {
          // Extract year from createdAt (assume ISO string or Date)
          let year = "";
          if (proj.createdAt) {
            try {
              const date = new Date(proj.createdAt);
              if (!isNaN(date.getTime())) {
                year = date.getFullYear().toString();
              }
            } catch {}
          }
          return `
    \\begin{twocolentry}{${year}}
      \\textbf{${escapeLatex(proj.title)}}\\end{twocolentry}
    \\vspace{0.10cm}
    \\begin{onecolentry}
      \\begin{highlights}
        \\item ${escapeLatex(proj.description)}
        \\item Tools Used: ${Array.isArray(proj.technologies) ? proj.technologies.map(escapeLatex).join(", ") : escapeLatex(proj.technologies || "")}
        ${proj.link ? `\\item Live Demo: \\href{${escapeLatex(proj.link)}}{${escapeLatex(proj.link)}}` : ""}
      \\end{highlights}
    \\end{onecolentry}
    \\vspace{0.15cm}
  `;
        })
        .join("\n")
}
\\section{Technologies}
\\begin{onecolentry}
${
  [
    groupedTechs.frontend.length > 0
      ? `    \\textbf{Frontend:} \\\n    ${groupedTechs.frontend.map(escapeLatex).join(", ")} \\\n    \\vspace{0.10cm}\n`
      : "",
    groupedTechs.backend.length > 0
      ? `    \\\\ \\textbf{Backend:} \\\n    ${groupedTechs.backend.map(escapeLatex).join(", ")} \\\n    \\vspace{0.10cm}\n`
      : "",
    groupedTechs.database.length > 0
      ? `    \\\\ \\textbf{Database:} \\\n    ${groupedTechs.database.map(escapeLatex).join(", ")} \\\n    \\vspace{0.10cm}\n`
      : "",
    groupedTechs.others.length > 0
      ? `    \\\\ \\textbf{Others:} \\\n    ${groupedTechs.others.map(escapeLatex).join(", ")} \\\n    \\vspace{0.10cm}\n`
      : "",
  ]
    .filter(Boolean)
    .join("") || "    No technologies found.\\\n"
}
\\end{onecolentry}
\\end{document}
`;

  // Output paths
  const outputDir = path.join(__dirname, "../public");
  const texPath = path.join(outputDir, "resume.tex");
  const pdfPath = path.join(outputDir, "john_lester_escarlan_resume.pdf");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Write LaTeX source for reference/debugging
  fs.writeFileSync(texPath, latexContent);

  // Compile LaTeX to PDF
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
