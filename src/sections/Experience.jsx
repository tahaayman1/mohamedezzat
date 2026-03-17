import { HiCalendar } from 'react-icons/hi';
import SectionTitle from '../components/SectionTitle';
import AnimatedSection from '../components/AnimatedSection';

export default function Experience({ data = [] }) {
  return (
    <section id="experience" className="relative py-28 md:py-40 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle="Professional Path" title="Experience" />

        <div className="space-y-5 max-w-4xl">
          {data.map((exp, index) => (
            <AnimatedSection key={exp.$id || index} variant="fadeUp" delay={index * 0.12}>
              <div className="glass-accent p-7 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <h3 className="text-lg md:text-xl font-semibold text-white">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/45 text-sm font-medium whitespace-nowrap">
                    <HiCalendar size={14} />
                    {exp.period}
                  </div>
                </div>
                <p className="text-white/50 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
