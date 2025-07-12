import ProfilePicture from "@/public/profile-pic.jpg";

const about = {
  section: "About Me",
  sectionDescription: "Who is John Lester?",
  image: {
    src: ProfilePicture,
    width: 0, // use the actual image width
    height: 0, // use the actual image height
    alt: "John Lester Profile Picture",
  },
  aboutMe: [
    "Computer Science student at UP Cebu with practical experience in full-stack development. I build web applications using React, Node.js, and work with databases to create functional solutions that solve real problems.",
    "My background in Mathematics provides strong analytical thinking for problem-solving and algorithm development. I have professional experience in system monitoring, error diagnosis, and web application development using C# and ASP.NET in team environments.",
  ],
  techStack: {
    intro: "Technologies I work with include but are not limited to:",
    techs: [
      "React",
      "Node.js",
      "JavaScript",
      "TypeScript",
      "C#",
      "ASP.NET",
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "MongoDB",
      "Tailwind CSS",
      "Git",
    ],
  },
};

export default about;
