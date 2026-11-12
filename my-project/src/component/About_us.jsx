import { motion } from 'motion/react';
import aboutUsImage from '../assets/about_us.jpg';

const About_us = () => {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center bg-[#f6e7dc] px-4 py-10 text-gray-600 sm:px-[5vw] sm:py-14 md:px-[5vw] md:py-16 lg:px-[7vw]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 sm:gap-10 md:flex-row md:gap-12 lg:gap-16">
        {/* Text Content */}
        <motion.div
          className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left"
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <span className="mb-2 text-sm font-medium uppercase tracking-[4px] text-[#C94077] sm:text-base sm:tracking-[5px]">
            ABOUT US
          </span>

          <h1 className="mb-4 text-3xl font-oswald font-semibold uppercase leading-tight text-gray-900 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl">
            Where Good Times and
            <br className="hidden sm:block" />
            Great Drinks Meet
          </h1>

          <p className="mb-0 max-w-prose text-left text-sm leading-6 text-[#4b5563] font-open-sans sm:text-base sm:leading-relaxed md:mb-8">
            Come to Pub & Lounge and unwind with your favorite drink while
            enjoying our vibrant decor and lively ambiance. Our talented
            bartenders craft the best cocktails in town, accompanied by a
            delicious menu to satisfy your appetite. Whether you're catching up
            with friends, having a date night, or just looking for a great time,
            you'll find it here at Pub & Lounge.
          </p>
        </motion.div>

        {/* Image Content */}
        <motion.div
          className="flex w-full justify-center md:w-1/2"
          initial={{ opacity: 0, x: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <motion.img
            whileHover={{ scale: 1.025 }}
            transition={{ duration: 0.35 }}
            className="object-cover object-center shadow-lg w-full max-w-[450px] lg:max-w-[520px] aspect-square"
            alt="About Us Hero"
            src={aboutUsImage}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About_us;