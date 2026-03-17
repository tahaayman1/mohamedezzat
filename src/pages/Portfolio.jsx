import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import SkeletonLoader from '../components/SkeletonLoader';
import ConsultationChat from '../components/ConsultationChat';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Education from '../sections/Education';
import Experience from '../sections/Experience';
import Certificates from '../sections/Certificates';
import Skills from '../sections/Skills';
import Languages from '../sections/Languages';
import Contact from '../sections/Contact';
import { usePersonalInfo, useCollection, useSectionTitles, useSubmitMessage } from '../hooks/useAppwrite';

export default function Portfolio() {
  const { data: personalInfo, loading: personalLoading } = usePersonalInfo();
  const { data: education, loading: eduLoading } = useCollection('EDUCATION');
  const { data: experiences, loading: expLoading } = useCollection('EXPERIENCES');
  const { data: certificates, loading: certLoading } = useCollection('CERTIFICATES');
  const { data: skills, loading: skillsLoading } = useCollection('SKILLS');
  const { data: languages, loading: langLoading } = useCollection('LANGUAGES');
  const { data: sectionTitles, loading: titlesLoading } = useSectionTitles();
  const { submitMessage } = useSubmitMessage();

  const isLoading = personalLoading || eduLoading || expLoading || certLoading || skillsLoading || langLoading || titlesLoading;

  return (
    <div className="relative bg-black min-h-screen">
      <div className="noise-overlay" />

      <Navbar />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <SkeletonLoader key="skeleton" />
        ) : (
          <main key="content">
            <Hero data={personalInfo} titles={sectionTitles.hero} />

            <div className="section-below-fold">
              <div className="section-divider" />
              <About data={personalInfo} titles={sectionTitles.about} />
            </div>

            <div className="section-below-fold">
              <div className="section-divider" />
              <Experience data={experiences} titles={sectionTitles.experience} />
            </div>

            <div className="section-below-fold">
              <div className="section-divider" />
              <Education data={education} titles={sectionTitles.education} />
            </div>

            <div className="section-below-fold">
              <div className="section-divider" />
              <Certificates data={certificates} titles={sectionTitles.certificates} />
            </div>

            <div className="section-below-fold">
              <div className="section-divider" />
              <Skills data={skills} titles={sectionTitles.skills} />
            </div>

            <div className="section-below-fold">
              <div className="section-divider" />
              <Languages data={languages} titles={sectionTitles.languages} />
            </div>

            <div className="section-below-fold">
              <div className="section-divider" />
              <Contact data={personalInfo} titles={sectionTitles.contact} />
            </div>
          </main>
        )}
      </AnimatePresence>

      {/* Floating consultation chatbot */}
      <ConsultationChat onSubmit={submitMessage} />
    </div>
  );
}
