import { motion } from 'motion/react';
import testimonialBg from '../assets/testimonial.jpg';

const Testimonial = () => {
  return (
    <section
      className="relative bg-cover bg-center text-gray-100 px-4 sm:px-[5vw] md:px-[6vw] lg:px-[7vw] py-16 sm:py-24"
      style={{ backgroundImage: `url(${testimonialBg})` }}
    >
      {/* Dark Overlay for Contrast */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content Container */}
      <div className="container mx-auto relative z-10 max-w-4xl">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          {/* Quote Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-8 h-8 sm:w-10 sm:h-10 text-[#C94077] mb-6 sm:mb-8"
            viewBox="0 0 975.036 975.036"
          >
            <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
          </svg>

          {/* Testimonial Quote */}
          <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-oswald uppercase font-semibold text-gray-50 leading-relaxed max-w-3xl">
            "I had an amazing time at this pub & lounge! The atmosphere was
            great, the drinks were top-notch, and the food was delicious."
          </blockquote>

          {/* Divider Line */}
          <span className="block h-1 w-12 rounded bg-[#C94077] my-6 sm:my-8"></span>

          {/* Author & Role */}
          <h2 className="text-gray-100 font-semibold tracking-widest text-sm sm:text-base uppercase font-oswald">
            Guy Hawkins
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;