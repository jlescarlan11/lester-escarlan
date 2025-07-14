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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
        <div className="col-span-1">
          <Image
            src={about.image.src}
            width={about.image.width}
            height={about.image.height}
            alt={about.image.alt}
            className="rounded-lg"
          />
        </div>
        <div className="col-span-2 text-lg space-y-4">
          {about.aboutMe.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
