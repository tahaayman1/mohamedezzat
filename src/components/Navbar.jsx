import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const sectionIds = ['hero', 'about', 'experience', 'education', 'certificates', 'skills', 'languages', 'contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observers.push(el);
      }
    });

    return () => {
      observers.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const isActive = (href) => {
    const id = href.replace('#', '');
    return activeSection === id;
  };

  return (
    <>
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav
          className={`rounded-full px-2 transition-all duration-500 border backdrop-blur-[24px] ${
            scrolled
              ? 'py-1 bg-white/[0.07] border-white/[0.12] shadow-lg shadow-black/40 backdrop-saturate-[1.8]'
              : 'py-1.5 bg-white/[0.04] border-white/[0.07] backdrop-saturate-[1.4]'
          }`}
        >
          <div className="flex items-center gap-1">
            <a
              href="#hero"
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/[0.06] transition-colors duration-300"
            >
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <span className="text-black font-bold text-[10px] tracking-wide">ME</span>
              </div>
              <span className="text-white/90 font-semibold text-sm hidden sm:block">
                Mohamed
              </span>
            </a>

            <div className="hidden md:flex items-center">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-white bg-white/[0.1]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[5px] hover:bg-white/[0.06] transition-colors"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                className="block w-4 h-[1.5px] bg-white/60 origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                className="block w-4 h-[1.5px] bg-white/60"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                className="block w-4 h-[1.5px] bg-white/60 origin-center"
              />
            </button>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-6 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                onClick={() => setMobileOpen(false)}
                className={`text-3xl font-light tracking-wide transition-colors duration-300 ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
