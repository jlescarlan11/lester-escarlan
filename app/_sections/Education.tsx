import SectionTitle from "../_components/common/SectionTitle";
import SharedCard from "../_components/common/SharedCard";
import education from "../_data/education";

const EducationSection = () => (
  <section className="section">
    <SectionTitle
      section={education.section}
      description={education.sectionDescription}
    />

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
  </section>
);

export default EducationSection;
