import { HiDownload } from 'react-icons/hi';
import SectionTitle from '../components/SectionTitle';
import AnimatedSection from '../components/AnimatedSection';
import { getFilePreviewUrl, getFileDownloadUrl } from '../hooks/useAppwrite';
import cvFile from '../assets/Mohamed_Ezzat_CV.pdf';
import profileImgFallback from '../assets/profile.jpg';

const highlights = [
  { label: 'Education', value: 'E-Commerce, 4th Year' },
  { label: 'Experience', value: '3+ Years Consulting' },
  { label: 'Certifications', value: '7+ Professional' },
];

export default function About({ data, titles = {} }) {
  const profileImg = (data?.photo_id && getFilePreviewUrl(data.photo_id)) || profileImgFallback;

  return (
    <section id="about" className="relative py-28 md:py-40 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle={titles.subtitle || "Get to know me"} title={titles.title || "About Me"} />

        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          <div className="lg:col-span-7">
            <AnimatedSection variant="fadeLeft">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <img src={profileImg} alt="Mohamed Ezzat" loading="lazy" width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {data?.name || 'Mohamed Ezzat'}
                  </h3>
                  <p className="text-white/50 text-sm">
                    {data?.title || 'Business Development Consultant'}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft" delay={0.1}>
              <p className="text-lg text-white/80 leading-relaxed mb-5">
                {data?.bio ||
                  'I am Mohammed, a fourth-year E-Commerce student. I have developed a passion for business development, which has driven me to embark on a journey of learning and reading to become well-versed in all aspects of this field.'}
              </p>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft" delay={0.2}>
              <p className="text-white/50 leading-relaxed mb-10">
                With a strong foundation in digital business development and strategic management,
                I combine academic knowledge with hands-on consulting experience to help businesses
                grow and thrive in the digital age.
              </p>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft" delay={0.3}>
              <a
                href={(data?.cv_id && getFileDownloadUrl(data.cv_id)) || cvFile}
                download="Mohamed_Ezzat_CV.pdf"
                className="btn-primary"
              >
                <HiDownload size={16} />
                Download CV
              </a>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-5">
            <AnimatedSection variant="fadeRight" delay={0.2}>
              <div className="glass-accent p-8">
                {highlights.map((item, index) => (
                  <div
                    key={item.label}
                    className={`py-5 ${
                      index !== highlights.length - 1 ? 'border-b border-white/[0.06]' : ''
                    }`}
                  >
                    <p className="text-white/45 text-xs font-semibold tracking-[0.18em] uppercase mb-2">
                      {item.label}
                    </p>
                    <p className="text-white text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
