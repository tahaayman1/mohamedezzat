import { motion } from 'framer-motion';
import { HiArrowDown, HiChevronDown } from 'react-icons/hi';
import { FaLinkedinIn } from 'react-icons/fa';
import { getFilePreviewUrl } from '../hooks/useAppwrite';
import profileImgFallback from '../assets/profile.jpg';

const LINKEDIN_URL = 'https://www.linkedin.com/in/mohamad-ezzat-16754b28a/';

export default function Hero({ data }) {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const firstName = data?.name?.split(' ')[0] || 'Mohamed';
  const lastName = data?.name?.split(' ')[1] || 'Ezzat';
  const profileImg = (data?.photo_id && getFilePreviewUrl(data.photo_id)) || profileImgFallback;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 lg:pt-28 lg:pb-16"
    >
      <div className="mesh-gradient">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 w-full">
        <div className="flex flex-col items-center text-center gap-0">

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mb-5 lg:mb-6"
          >
            <div className="absolute -inset-4 rounded-full bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-white/8 to-transparent blur-sm" />
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-1 ring-white/20 shadow-2xl shadow-white/5">
              <img
                src={profileImg}
                alt={data?.name || 'Mohamed Ezzat'}
                width={176}
                height={176}
                fetchPriority="high"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mb-5 lg:mb-5"
          >
            <span className="inline-block px-5 py-2 rounded-full text-xs font-semibold tracking-[0.18em] uppercase text-white/50 border border-white/10 bg-white/[0.03]">
              Business Development Consultant
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7rem] font-extrabold tracking-tighter leading-[0.85] mb-5 lg:mb-5"
          >
            <span className="block text-white">{firstName}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
              {lastName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-white/50 text-base sm:text-lg lg:text-base max-w-md mx-auto mb-3 lg:mb-3 leading-relaxed font-light"
          >
            Helping businesses grow through strategic development and digital innovation.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="w-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6 lg:mb-6"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-wrap gap-4 items-center justify-center"
          >
            <button onClick={scrollToAbout} className="btn-primary">
              Explore My Work
              <HiArrowDown size={14} />
            </button>
            <a href="#contact" className="btn-ghost">
              Get In Touch
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedinIn size={16} />
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        onClick={scrollToAbout}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer group"
      >
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/40 group-hover:text-white/60 transition-colors duration-300">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiChevronDown className="text-white/40 group-hover:text-white/60 transition-colors duration-300" size={16} />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
    </section>
  );
}
