import { motion } from 'motion/react';
import banner_2 from '../../assets/banner-2.jpg'


const Feature = () => {
  return (
    <section className="relative flex flex-col min-h-[80vh] items-center justify-center bg-[#ffffff] px-4 py-10 text-gray-600 sm:px-[5vw] sm:py-14 md:px-[5vw] md:py-16 lg:px-[7vw]">
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-20 mt-3 text-3xl font-semibold xl:leading-14 text-gray-900 uppercase font-oswald sm:text-2xl sm:leading-tight md:text-4xl lg:text-4xl xl:text-4xl max-w-7xl"
      >
        It was the summer of 2009 when the doors first opened in the heart of
        New York City. The owners, two childhood friends, had a dream of
        creating a space where people could come together, relax, and enjoy.
      </motion.h1>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 sm:gap-10 md:flex-row md:gap-12 lg:gap-10 mb-10 max-sm:mb-2">
        {/* Image Content */}
        <motion.div
          className="flex w-full justify-center md:w-1/2"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            whileHover={{ scale: 1.025 }}
            transition={{ duration: 0.35 }}
            className="object-cover object-center shadow-lg  w-full max-w-[450px] lg:max-w-[520px] aspect-square"
            alt=""
            src={banner_2}
          />
        </motion.div>
        {/* Text Content */}
        <motion.div
          className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left pr-20"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="mb-0 max-w-prose text-left text-sm leading-6 text-[#4b5563] font-open-sans sm:text-base sm:leading-relaxed md:mb-8">
            The Pub & Lounge we became a staple in the neighbourhood, with its
            cozy atmosphere, friendly staff, and extensive menu of drinks and
            food. From local craft beers to classic cocktails, the pub had
            something for everyone.
          </p>
          <p className="mb-0 max-w-prose text-left text-sm leading-6 text-[#4b5563] font-open-sans sm:text-base sm:leading-relaxed md:mb-8">
            Over the years, The Pub & Lounge continued to thrive and grow,
            hosting events and gatherings that brought the community together.
            From trivia nights to live music performances, the pub was always
            buzzing with activity.
          </p>
          <p className="mb-0 max-w-prose text-left text-sm leading-6 text-[#4b5563] font-open-sans sm:text-base sm:leading-relaxed md:mb-8">
            Now, more than a decade later, The Pub & Lounge continues to serve
            up great drinks, delicious food, and unforgettable memories for
            locals and visitors alike. And as the city around it continues to
            change, it remains a constant, a place where people can always come
            back to for a taste of that New York City spirit.
          </p>
        </motion.div>
      </div>

    </section>
  );
};

export default Feature;
