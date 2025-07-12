import Image from "next/image";
import SectionTitle from "../_components/common/SectionTitle";
import about from "../_data/about";

const AboutSection = () => {
  return (
    <section className="section">
      <SectionTitle
        section={about.section}
        description={about.sectionDescription}
      />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1">
          <Image
            src={about.image.src}
            width={about.image.width}
            height={about.image.height}
            alt={about.image.alt}
            className="rounded-lg max-w-full max-h-fit"
          />
        </div>
        <div className="col-span-2 text-lg">
          {about.aboutMe.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <p>{about.techStack.intro}</p>
          <ul className="list-disc pl-5 grid grid-cols-4">
            {about.techStack.techs.map((tech) => (
              <li key={tech} className="text-sm">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
