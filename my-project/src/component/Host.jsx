import { motion } from 'motion/react';
import host from '../assets/host.jpg';
const Host = () => {
  return (
    <section className="text-gray-300 relative flex min-h-[80vh] items-center justify-center bg-[#1E2329] px-4 sm:px-[5vw] md:px-[6vw] lg:px-[7vw] py-16 max-sm:pt-10 max-sm:pb-5 max-sm:py-10">
      <div className=" mx-auto flex flex-col md:flex-row items-center w-full justify-between gap-8 md:gap-12 lg:gap-16">
        {/* Image Content */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <motion.img
            whileHover={{ scale: 1.025 }}
            transition={{ duration: 0.35 }}
            className="object-cover object-center shadow-lg  w-full max-w-[450px] lg:max-w-[520px] aspect-square"
            alt="Host"
            src={host}
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
        >
          <span className="text-[16px] text-[#C94077] tracking-[5px] font-medium uppercase mb-2">
            MEET THE HOST
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-oswald uppercase mb-4 font-semibold text-gray-100 leading-tight">
            Brooklyn Simmons
          </h1>

          <p className="mb-8 leading-relaxed text-gray-300 text-sm sm:text-base font-open-sans sm:text-left text-justify">
            As a Pub & Lounge host, you are the first point of contact for our
            guests. Your warm and welcoming personality sets the tone for their
            entire experience with us. You are responsible for providing
            excellent customer service, making sure that every guest feels
            valued and appreciated.
          </p>
          <p className="mb-8 leading-relaxed text-gray-300 text-sm sm:text-base font-open-sans sm:text-left text-justify max-sm:mb-2">
            In addition to greeting and seating guests, you will also take their
            orders and ensure that they are served promptly and correctly. You
            will be knowledgeable about our menu offerings and be able to answer
            any questions that guests may have.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Host;