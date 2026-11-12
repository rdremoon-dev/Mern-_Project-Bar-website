import { motion } from 'motion/react';
import { Link } from 'react-router';
import heroBanner from '../assets/Hero_banner.jpg';

const Hero = () => {

  return (
    <div aria-labelledby='Hero'
      className="relative flex min-h-screen items-end justify-start bg-cover bg-top px-4 sm:px-[5vw] md:px-[5vw] lg:px-[7vw] py-5"
      style={{ backgroundImage: `url(${heroBanner})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 flex flex-col gap-4 max-sm:gap-2 pb-6 sm:pb-10 max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.15 },
          },
        }}
      >
        <motion.span
          className="block h-1 w-10 bg-gray-50"
          variants={{
            hidden: { opacity: 0, scaleX: 0, originX: 0 },
            visible: { opacity: 1, scaleX: 1, transition: { duration: 0.5 } },
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-oswald uppercase mt-3 mb-2 font-semibold text-gray-50 leading-tight sm:leading-tight"
        >
          Unforgettable Nights at The <br className="max-sm:hidden block" />
          City of New York
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-sm sm:text-base md:text-lg font-open-sans text-gray-100 leading-relaxed max-w-xl"
        >
          Raise the glass and experience the best in craft beers and cocktails.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          className="flex flex-wrap gap-3 mt-4"
        >
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className="inline-flex rounded bg-[#f10d05ee] px-6 py-2.5 text-sm font-medium text-gray-50 transition-all duration-300 hover:shadow-lg sm:px-8 sm:py-3 sm:text-base lg:text-lg"
            >
              Reserve a table
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className="inline-flex rounded border-2 border-gray-100 bg-transparent px-6 py-2.5 text-sm font-medium text-gray-50 transition-all duration-300 hover:border-[#f10d05ee] hover:bg-[#f10d05ee] sm:px-8 sm:py-3 sm:text-base lg:text-lg"
            >
              Contact us
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;