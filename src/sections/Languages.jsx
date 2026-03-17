import { HiGlobeAlt } from 'react-icons/hi';
import SectionTitle from '../components/SectionTitle';
import AnimatedSection from '../components/AnimatedSection';

export default function Languages({ data = [] }) {
  return (
    <section id="languages" className="relative py-28 md:py-40 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle="Communication" title="Languages" />

        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl">
          {data.map((lang, index) => (
            <AnimatedSection key={lang.$id || index} variant="fadeUp" delay={index * 0.1}>
              <div className="glass p-7 text-center">
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-5">
                  <HiGlobeAlt className="text-white/50" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {lang.name}
                </h3>
                <span className="text-white/50 text-sm font-medium">
                  {lang.proficiency}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
