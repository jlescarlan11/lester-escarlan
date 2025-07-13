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
import {
  SiC,
  SiCplusplus,
  SiDjango,
  SiDocker,
  SiDotnet,
  SiFigma,
  SiFirebase,
  SiGo,
  SiNetlify,
  SiGraphql,
  SiHeroku,
  SiJira,
  SiKotlin,
  SiKubernetes,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiMui,
  SiMysql,
  SiOracle,
  SiPostgresql,
  SiPython,
  SiRedis,
  SiRedux,
  SiRuby,
  SiRubyonrails,
  SiSass,
  SiSpring,
  SiSqlite,
  SiTypescript,
  SiWebpack,
  SiYarn,
} from "react-icons/si";
import SectionTitle from "../_components/common/SectionTitle";
import techStack from "../_data/techStack";

const popularTechs = [
  { name: "JavaScript", icon: RiJavascriptFill },
  { name: "TypeScript", icon: SiTypescript },
  { name: "React", icon: RiReactjsFill },
  { name: "Next.js", icon: RiNextjsFill },
  { name: "Node.js", icon: RiNodejsFill },
  { name: "Python", icon: SiPython },
  { name: "HTML", icon: RiHtml5Fill },
  { name: "CSS", icon: RiCss3Fill },
  { name: "Tailwind CSS", icon: RiTailwindCssFill },
  { name: "Bootstrap", icon: RiBootstrapFill },
  { name: "Material-UI", icon: SiMui },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MySQL", icon: SiMysql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Git", icon: RiGitBranchFill },
  { name: "GitHub", icon: RiGithubFill },
  { name: "Vercel", icon: RiVercelFill },
  { name: "Netlify", icon: SiNetlify },
  { name: "AWS", icon: RiAmazonFill },
  { name: "Docker", icon: SiDocker },
  { name: "Java", icon: RiJavaFill },
  { name: "C#", icon: RiHashtag },
  { name: "PHP", icon: RiPhpFill },
  { name: "Laravel", icon: SiLaravel },
  { name: "Redux", icon: SiRedux },
  { name: "Express.js", icon: RiTerminalBoxFill },
  { name: "ASP.NET", icon: SiDotnet },
  { name: "Spring", icon: SiSpring },
  { name: "Kotlin", icon: SiKotlin },
  { name: "Go", icon: SiGo },
  { name: "Django", icon: SiDjango },
  { name: "Flask", icon: RiFlaskFill },
  { name: "Sass", icon: SiSass },
  { name: "Webpack", icon: SiWebpack },
  { name: "Yarn", icon: SiYarn },
  { name: "npm", icon: RiNpmjsFill },
  { name: "Jest", icon: RiTestTubeFill },
  { name: "C++", icon: SiCplusplus },
  { name: "C", icon: SiC },
  { name: "Ruby on Rails", icon: SiRubyonrails },
  { name: "Ruby", icon: SiRuby },
  { name: "Android", icon: RiAndroidFill },
  { name: "Apple", icon: RiAppleFill },
  { name: "Firebase", icon: SiFirebase },
  { name: "GraphQL", icon: SiGraphql },
  { name: "Linux", icon: SiLinux },
  { name: "Redis", icon: SiRedis },
  { name: "Oracle", icon: SiOracle },
  { name: "SQLite", icon: SiSqlite },
  { name: "Figma", icon: SiFigma },
  { name: "Jira", icon: SiJira },
  { name: "Heroku", icon: SiHeroku },
  { name: "Google Cloud", icon: RiGoogleFill },
  { name: "Kubernetes", icon: SiKubernetes },
];

const techCategories = {
  Frontend: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Material-UI",
    "Sass",
    "Webpack",
    "Yarn",
    "npm",
    "Jest",
  ],
  Backend: [
    "Node.js",
    "Express.js",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Laravel",
    "ASP.NET",
    "Spring",
    "Kotlin",
    "Go",
    "Django",
    "Flask",
    "Ruby on Rails",
    "Ruby",
    "GraphQL",
  ],
  Database: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Oracle", "SQLite"],
  Others: [
    "Git",
    "GitHub",
    "Vercel",
    "Netlify",
    "AWS",
    "Docker",
    "Firebase",
    "Linux",
    "Figma",
    "Jira",
    "Heroku",
    "Google Cloud",
    "Kubernetes",
    "Apple",
    "Android",
    "C++",
    "C",
  ],
};

const TechStackSection = () => {
  // Only show techs that are in techStack.techs
  const filteredTechs = popularTechs.filter((t) =>
    techStack.techs.includes(t.name)
  );

  // Categorize filtered techs
  const categorized = Object.entries(techCategories).reduce(
    (acc, [category, names]) => {
      acc[category] = filteredTechs.filter((t) => names.includes(t.name));
      return acc;
    },
    {} as Record<string, typeof filteredTechs>
  );

  // Find techs not in any category
  const categorizedNames = Object.values(techCategories).flat();
  const others = filteredTechs.filter(
    (t) => !categorizedNames.includes(t.name)
  );
  if (others.length > 0) {
    categorized["Others"] = [...(categorized["Others"] || []), ...others];
  }

  return (
    <section id="techstack" className="section">
      <SectionTitle section="Technologies" description="What I use and know" />
      <p className="mb-4">{techStack.intro}</p>
      <div className="space-y-8">
        {Object.entries(categorized).map(
          ([category, techs]) =>
            techs.length > 0 && (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {techs.map(({ name, icon: Icon }) => (
                    <div
                      key={name}
                      className="flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Icon size={40} className="mb-2 text-primary" />
                      <span className="text-xs mt-1 opacity-80">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </section>
  );
};

export default TechStackSection;
