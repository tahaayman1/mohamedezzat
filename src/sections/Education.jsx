import { HiAcademicCap } from 'react-icons/hi';
import SectionTitle from '../components/SectionTitle';
import AnimatedSection from '../components/AnimatedSection';

export default function Education({ data = [] }) {
  return (
    <section id="education" className="relative py-28 md:py-40 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle="Academic Journey" title="Education" />

        <div className="max-w-3xl">
          {data.map((edu, index) => (
            <AnimatedSection key={edu.$id || index} variant="fadeUp" delay={index * 0.15}>
              <div className="relative pl-10 pb-14 last:pb-0 group">
                <div className="absolute left-[11px] top-7 bottom-0 w-px bg-gradient-to-b from-white/15 to-transparent" />

                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border border-white/15 bg-black flex items-center justify-center group-hover:border-white/30 transition-colors duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition-colors duration-500" />
                </div>

                <div className="glass p-7">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <HiAcademicCap className="text-white/50" size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1.5">
                        {edu.institution || 'Higher Institute of E-Commerce Systems'}
                      </h3>
                      <span className="inline-block text-white/50 text-sm font-medium mb-2">
                        Degree: {edu.degree || 'Very Good'}
                      </span>
                      {edu.description && (
                        <p className="text-white/50 text-sm leading-relaxed mt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
