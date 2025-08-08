import HeadingHiglight from "./HeadingHiglight";

interface SectionTitleProps {
  section: string;
  description: string;
}

const SectionTitle = ({ section, description }: SectionTitleProps) => {
  return (
    <div className="mb-8">
      <HeadingHiglight>{description.toLocaleUpperCase()}</HeadingHiglight>
      <h2>{section}</h2>
    </div>
  );
};

export default SectionTitle;
