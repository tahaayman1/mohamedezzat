import { motion } from 'framer-motion';

function Pulse({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-white/[0.04] ${className}`} />;
}

export default function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-black min-h-screen"
    >
      <section className="min-h-screen flex items-center justify-center pt-24 pb-20">
        <div className="flex flex-col items-center text-center gap-5 max-w-4xl mx-auto px-5 w-full">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full animate-pulse bg-white/[0.04]" />
          <Pulse className="w-64 h-9 rounded-full" />
          <Pulse className="w-72 sm:w-96 h-14 sm:h-20 rounded-xl" />
          <Pulse className="w-56 sm:w-80 h-14 sm:h-20 rounded-xl" />
          <Pulse className="w-80 h-5 rounded-lg" />
          <Pulse className="w-12 h-px" />
          <div className="flex gap-4">
            <Pulse className="w-40 h-12 rounded-full" />
            <Pulse className="w-32 h-12 rounded-full" />
            <Pulse className="w-11 h-11 rounded-full" />
          </div>
        </div>
      </section>

      {[1, 2, 3].map((i) => (
        <section key={i} className="py-28 md:py-40 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 md:mb-20">
              <Pulse className="w-24 h-3 rounded-full mb-4" />
              <Pulse className="w-48 sm:w-64 h-10 rounded-xl mb-6" />
              <Pulse className="w-8 h-0.5" />
            </div>
            <div className="space-y-5">
              <Pulse className="w-full h-32 rounded-2xl" />
              <Pulse className="w-full h-32 rounded-2xl" />
              {i === 1 && <Pulse className="w-full h-32 rounded-2xl" />}
            </div>
          </div>
        </section>
      ))}
    </motion.div>
  );
}
