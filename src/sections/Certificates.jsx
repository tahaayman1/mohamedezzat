import { HiOfficeBuilding } from 'react-icons/hi';
import SectionTitle from '../components/SectionTitle';
import AnimatedSection from '../components/AnimatedSection';

export default function Certificates({ data = [] }) {
  return (
    <section id="certificates" className="relative py-28 md:py-40 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle="Continuous Learning" title="Certificates & Courses" />

        <div className="grid sm:grid-cols-2 gap-5">
          {data.map((cert, index) => (
            <AnimatedSection key={cert.$id || index} variant="scale" delay={index * 0.07}>
              <div className="glass p-7 h-full flex flex-col">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mb-5" />

                <h3 className="text-[15px] font-semibold text-white leading-snug flex-1 mb-4">
                  {cert.name}
                </h3>

                <div className="flex items-center gap-2.5 pt-4 border-t border-white/[0.05]">
                  <HiOfficeBuilding className="text-white/40 flex-shrink-0" size={14} />
                  <span className="text-white/50 text-sm">
                    {cert.institution}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
