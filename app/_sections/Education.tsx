import SectionTitle from "../_components/common/SectionTitle";
import education from "../_data/education";
import SharedCard from "../_components/common/SharedCard";

const EducationSection = () => {
  return (
    <section className="section">
      <SectionTitle
        section={education.section}
        description={education.sectionDescription}
      />
      <div className="grid lg:grid-cols-2 gap-x-8 gap-y-4">
        {education.educationData.map((item, index) => (
          <SharedCard
            key={index}
            logo={item.logo}
            mainTitle={item.institution}
            subTitle={item.degree}
            period={item.period}
            details={item.details}
            technologies={item.technologies}
          />
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
