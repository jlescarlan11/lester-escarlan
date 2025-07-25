import {
  RiAmazonFill,
  RiAndroidFill,
  RiAppleFill,
  RiBootstrapFill,
  RiCss3Fill,
  RiFlaskFill,
  RiGitBranchFill,
  RiGithubFill,
  RiGoogleFill,
  RiHashtag,
  RiHtml5Fill,
  RiJavaFill,
  RiJavascriptFill,
  RiNextjsFill,
  RiNodejsFill,
  RiNpmjsFill,
  RiPhpFill,
  RiReactjsFill,
  RiTailwindCssFill,
  RiTerminalBoxFill,
  RiTestTubeFill,
  RiVercelFill,
} from "react-icons/ri";
import { VscVscode } from "react-icons/vsc";
import {
  SiC,
  SiCplusplus,
  SiDjango,
  SiDocker,
  SiDotnet,
  SiFigma,
  SiFirebase,
  SiGo,
  SiGraphql,
  SiHeroku,
  SiIntellijidea,
  SiJira,
  SiKotlin,
  SiKubernetes,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNetlify,
  SiOracle,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiRedis,
  SiRedux,
  SiRuby,
  SiRubyonrails,
  SiSpring,
  SiSqlite,
  SiTypescript,
  SiVite,
  SiWebpack,
  SiYarn,
} from "react-icons/si";

import SectionTitle from "../_components/common/SectionTitle";
import techStack from "../_data/techStack";

const TECH_ICONS = {
  JavaScript: RiJavascriptFill,
  TypeScript: SiTypescript,
  Python: SiPython,
  Java: RiJavaFill,
  "C#": RiHashtag,
  "C++": SiCplusplus,
  C: SiC,
  Go: SiGo,
  PHP: RiPhpFill,
  Ruby: SiRuby,
  Kotlin: SiKotlin,
  HTML: RiHtml5Fill,
  CSS: RiCss3Fill,
  React: RiReactjsFill,
  Redux: SiRedux,
  "Tailwind CSS": RiTailwindCssFill,
  Bootstrap: RiBootstrapFill,
  "Material-UI": SiMui,
  "Node.js": RiNodejsFill,
  "Express.js": RiTerminalBoxFill,
  Laravel: SiLaravel,
  Django: SiDjango,
  Flask: RiFlaskFill,
  "Spring Boot": SiSpring,
  Spring: SiSpring,
  "ASP.NET Core": SiDotnet,
  "ASP.NET": SiDotnet,
  "Ruby on Rails": SiRubyonrails,
  "Next.js": RiNextjsFill,
  Jest: RiTestTubeFill,
  Webpack: SiWebpack,
  Yarn: SiYarn,
  npm: RiNpmjsFill,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  Oracle: SiOracle,
  SQLite: SiSqlite,
  Git: RiGitBranchFill,
  GitHub: RiGithubFill,
  Vercel: RiVercelFill,
  Netlify: SiNetlify,
  AWS: RiAmazonFill,
  Docker: SiDocker,
  Firebase: SiFirebase,
  Linux: SiLinux,
  Figma: SiFigma,
  Jira: SiJira,
  Heroku: SiHeroku,
  "Google Cloud": RiGoogleFill,
  Kubernetes: SiKubernetes,
  Apple: RiAppleFill,
  Android: RiAndroidFill,
  GraphQL: SiGraphql,
  "Visual Studio Code": VscVscode,
  "IntelliJ IDEA": SiIntellijidea,
  Vite: SiVite,
  Postman: SiPostman,
  SQL: SiPostgresql,
} as const;

const CATEGORIES = {
   "Languages": [
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
  "Frameworks": [
    "ASP.NET Core",
    "Next.js",
    "React",
    "Node.js",
    "Laravel",
    "Express.js",
  ],
  "Tools": [
    "Git",
    "Visual Studio Code",
    "Postman",
    "Vite",
    "Figma",
    "IntelliJ IDEA",
    "Docker",
  ],
  "Databases": [
    "Supabase",
    "Prisma",
    "SQL Server"
  ],
  "Libraries": [
    "Tailwind CSS",
    "Bootstrap",
    "Radix UI",
    "Material-UI"
  ]
} as const;

const TechCard = ({ tech }: { tech: string }) => {
  const Icon = TECH_ICONS[tech as keyof typeof TECH_ICONS];

  return (
    <div className="flex flex-col items-center justify-center text-center bg-muted border-1 border-muted-foreground/30 shadow-sm rounded-lg p-3 hover:shadow-md transition-shadow mb-2">
      {Icon ? (
        <Icon size={40} className="mb-2 text-primary" />
      ) : (
        <span className="mb-2 text-primary text-3xl">?</span>
      )}
      <span className="text-xs mt-1 opacity-80 break-words">{tech}</span>
    </div>
  );
};

const TechStackSection = () => {
  const userTechs = new Set(techStack.techs);

  return (
    <section className="section">
      <SectionTitle section="Technologies" description="What I use and know" />
      <p className="mb-4">{techStack.intro}</p>
      <div className="">
        {Object.entries(CATEGORIES).map(([category, techs]) => {
          const availableTechs = techs.filter((tech) => userTechs.has(tech));

          if (availableTechs.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-2">{category}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {availableTechs.map((tech) => (
                  <TechCard key={tech} tech={tech} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TechStackSection;
