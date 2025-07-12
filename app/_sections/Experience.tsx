import experience from "../_data/experience";
import SectionTitle from "../_components/common/SectionTitle";
import SharedCard from "../_components/common/SharedCard";

const ExperienceSection = () => {
  return (
    <section className="section">
      <SectionTitle
        section={experience.section}
        description={experience.sectionDescription}
      />
      <div className="grid lg:grid-cols-2 gap-x-8 gap-y-4">
        {experience.experienceData.map((item, index) => (
          <SharedCard
            key={index}
            logo={item.logo}
            mainTitle={item.company}
            subTitle={item.position}
            period={item.period}
            details={item.details}
            technologies={item.technologies}
          />
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
