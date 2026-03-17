import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import SkeletonLoader from '../components/SkeletonLoader';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Education from '../sections/Education';
import Experience from '../sections/Experience';
import Certificates from '../sections/Certificates';
import Skills from '../sections/Skills';
import Languages from '../sections/Languages';
import Contact from '../sections/Contact';
import { usePersonalInfo, useCollection } from '../hooks/useAppwrite';

export default function Portfolio() {
  const { data: personalInfo, loading: personalLoading } = usePersonalInfo();
  const { data: education, loading: eduLoading } = useCollection('EDUCATION');
  const { data: experiences, loading: expLoading } = useCollection('EXPERIENCES');
  const { data: certificates, loading: certLoading } = useCollection('CERTIFICATES');
  const { data: skills, loading: skillsLoading } = useCollection('SKILLS');
  const { data: languages, loading: langLoading } = useCollection('LANGUAGES');

  const isLoading = personalLoading || eduLoading || expLoading || certLoading || skillsLoading || langLoading;

  return (
    <div className="relative bg-black min-h-screen">
      <div className="noise-overlay" />

      <Navbar />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <SkeletonLoader key="skeleton" />
        ) : (
          <main key="content">
            <Hero data={personalInfo} />

            <div className="section-divider" />
            <About data={personalInfo} />

            <div className="section-divider" />
            <Experience data={experiences} />

            <div className="section-divider" />
            <Education data={education} />

            <div className="section-divider" />
            <Certificates data={certificates} />

            <div className="section-divider" />
            <Skills data={skills} />

            <div className="section-divider" />
            <Languages data={languages} />

            <div className="section-divider" />
            <Contact data={personalInfo} />
          </main>
        )}
      </AnimatePresence>
    </div>
  );
}
