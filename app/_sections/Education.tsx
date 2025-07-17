import SectionTitle from "../_components/common/SectionTitle";
import SharedCard from "../_components/common/SharedCard";
import education from "../_data/education";

const EducationSection = () => (
  <section className="section">
    <SectionTitle
      section={education.section}
      description={education.sectionDescription}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {education.educationData.map((item, index) => (
        <SharedCard
          key={index}
          logo={item.logo}
          mainTitle={item.degree}
          subTitle={item.institution}
          period={item.period}
          details={item.details}
          technologies={item.technologies}
        />
      ))}
    </div>
  </section>
);

export default EducationSection;
