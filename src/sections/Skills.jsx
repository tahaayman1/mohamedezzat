import SectionTitle from '../components/SectionTitle';
import AnimatedSection from '../components/AnimatedSection';

export default function Skills({ data = [], titles = {} }) {
  return (
    <section id="skills" className="relative py-28 md:py-40 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle={titles.subtitle || "What I Excel At"} title={titles.title || "Skills"} />

        <AnimatedSection>
          <div className="flex flex-wrap gap-3">
            {data.map((skill, index) => (
              <AnimatedSection key={skill.$id || index} variant="scale" delay={index * 0.06}>
                <span className="skill-tag">{skill.name}</span>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
