import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane, HiCheckCircle, HiExclamationCircle, HiCode } from 'react-icons/hi';
import { FaLinkedinIn } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import AnimatedSection from '../components/AnimatedSection';
import { useSubmitMessage } from '../hooks/useAppwrite';

const LINKEDIN_URL = 'https://www.linkedin.com/in/mohamad-ezzat-16754b28a/';

export default function Contact({ data }) {
  const email = data?.email || 'ezzatm768@gmail.com';
  const phone = data?.phone || '+201507623769';
  const { submitMessage, submitting, success, error, reset } = useSubmitMessage();

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitMessage(form);
    if (result.success) {
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

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
        <SectionTitle subtitle="Let's Connect" title="Get In Touch" />

        <div className="grid lg:grid-cols-2 gap-14 max-w-5xl">
          {/* Left - Contact info + links */}
          <div>
            <AnimatedSection variant="fadeLeft">
              <p className="text-lg text-white/70 leading-relaxed mb-5">
                I'm always open to discussing new opportunities, business ideas,
                or partnerships.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                Whether you have a project in mind or just want to connect,
                feel free to reach out through any of the channels listed here
                or send me a message directly.
              </p>
            </AnimatedSection>

            <div className="space-y-3">
              {contactLinks.map((item, index) => (
                <AnimatedSection key={item.label} variant="fadeLeft" delay={0.1 + index * 0.08}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="glass p-4 flex items-center gap-4 group cursor-pointer"
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
                    <div className="glass p-4 flex items-center gap-4">
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

          {/* Right - Contact form */}
          <AnimatedSection variant="fadeRight" delay={0.15}>
            <form onSubmit={handleSubmit} className="glass-accent p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-semibold text-white/90 mb-2">Send a Message</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-white/45 tracking-[0.1em] uppercase mb-2">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-white/45 tracking-[0.1em] uppercase mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-white/45 tracking-[0.1em] uppercase mb-2">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-white/45 tracking-[0.1em] uppercase mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or idea..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300 resize-none"
                />
              </div>

              {/* Success message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <HiCheckCircle className="text-green-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-green-400 text-sm font-medium">Message sent successfully!</p>
                    <p className="text-green-400/60 text-xs mt-0.5">I'll get back to you as soon as possible.</p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="ml-auto text-green-400/40 hover:text-green-400 transition-colors text-xs"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <HiExclamationCircle className="text-red-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-red-400 text-sm font-medium">Failed to send message</p>
                    <p className="text-red-400/60 text-xs mt-0.5">Please try again or reach out via email directly.</p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="ml-auto text-red-400/40 hover:text-red-400 transition-colors text-xs"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <HiPaperAirplane size={14} className="rotate-90" />
                  </>
                )}
              </button>
            </form>
          </AnimatedSection>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 pt-10 border-t border-white/[0.10]"
        >
          {/* Mohamed's social icons */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={14} />
            </a>
            <a
              href={`mailto:${email}`}
              className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300"
              aria-label="Email"
            >
              <HiMail size={15} />
            </a>
            <a
              href={`tel:${phone}`}
              className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300"
              aria-label="Phone"
            >
              <HiPhone size={14} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-white/50 text-sm mb-6">
            &copy; {new Date().getFullYear()} Mohamed Ezzat. All rights reserved.
          </p>

          {/* Developer credit */}
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
