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
      <div className="space-y-6">
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
