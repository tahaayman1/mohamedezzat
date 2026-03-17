import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiCode } from 'react-icons/hi';
import { FaLinkedinIn } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import AnimatedSection from '../components/AnimatedSection';

const LINKEDIN_URL = 'https://www.linkedin.com/in/mohamad-ezzat-16754b28a/';

export default function Contact({ data, titles = {} }) {
  const email = data?.email || 'ezzatm768@gmail.com';
  const phone = data?.phone || '+201507623769';

  const contactLinks = [
    {
      icon: HiMail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: HiPhone,
      label: 'Phone',
      value: phone,
      href: `tel:${phone}`,
    },
    {
      icon: FaLinkedinIn,
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: LINKEDIN_URL,
      external: true,
    },
    {
      icon: HiLocationMarker,
      label: 'Location',
      value: 'Egypt',
      href: null,
    },
  ];

  return (
    <section id="contact" className="relative py-28 md:py-40 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionTitle subtitle={titles.subtitle || "Let's Connect"} title={titles.title || "Get In Touch"} />

        <div className="max-w-2xl mx-auto">
          <AnimatedSection variant="fadeLeft">
            <p className="text-lg text-white/70 leading-relaxed mb-5">
              I'm always open to discussing new opportunities, business ideas,
              or partnerships.
            </p>
            <p className="text-white/50 leading-relaxed mb-8">
              Whether you have a project in mind or just want to connect,
              feel free to reach out through any of the channels listed here.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-3">
            {contactLinks.map((item, index) => (
              <AnimatedSection key={item.label} variant="fadeUp" delay={0.1 + index * 0.08}>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="glass p-4 flex items-center gap-4 group cursor-pointer h-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.08] transition-colors duration-300">
                      <item.icon className="text-white/50 group-hover:text-white/70 transition-colors duration-300" size={16} />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-semibold tracking-[0.12em] uppercase mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-white/80 font-medium text-sm group-hover:text-white transition-colors duration-300">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="glass p-4 flex items-center gap-4 h-full">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-white/50" size={16} />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-semibold tracking-[0.12em] uppercase mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-white/80 font-medium text-sm">{item.value}</p>
                    </div>
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 pt-10 border-t border-white/[0.10]"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={16} />
            </a>
            <a
              href={`mailto:${email}`}
              className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300"
              aria-label="Email"
            >
              <HiMail size={17} />
            </a>
            <a
              href={`tel:${phone}`}
              className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300"
              aria-label="Phone"
            >
              <HiPhone size={16} />
            </a>
          </div>

          <p className="text-center text-white/50 text-sm mb-6">
            &copy; {new Date().getFullYear()} Mohamed Ezzat. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 pt-5 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-white/45 text-sm">
              <HiCode size={14} className="text-white/40" />
              <span>Developed by</span>
              <a
                href="https://wa.me/201103795882"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors duration-300 font-medium"
              >
                Taha Ayman
              </a>
            </div>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
