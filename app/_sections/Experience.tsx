import SectionTitle from "../_components/common/SectionTitle";
import SharedCard from "../_components/common/SharedCard";
import experience from "../_data/experience";

const ExperienceSection = () => (
  <section className="section">
    <SectionTitle
      section={experience.section}
      description={experience.sectionDescription}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {experience.experienceData.map((item, index) => (
        <SharedCard
          key={index}
          logo={item.logo}
          mainTitle={item.position}
          subTitle={item.company}
          period={item.period}
          details={item.details}
          technologies={item.technologies}
        />
      ))}
    </div>
  </section>
);

export default ExperienceSection;
