import { motion } from 'motion/react';
import menuBanner from '../assets/banner-2.jpg';
import Menu_card from '../component/Menu_card';

const Menus = () => {
  return (
    <main>
      <section
        aria-labelledby="menu-page-title"
        className="relative flex min-h-[65vh] items-center justify-center bg-cover bg-center px-4 pb-12 pt-28 text-center sm:px-[5vw] lg:px-[7vw]"
        style={{ backgroundImage: `url(${menuBanner})` }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-white"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
          }}
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#e889a9]"
          >
            Good food. Great drinks.
          </motion.p>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}
            id="menu-page-title"
            className="font-oswald text-5xl font-semibold uppercase leading-tight sm:text-6xl md:text-7xl"
          >
            Our Menu
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            className="mx-auto mt-5 max-w-xl font-open-sans text-base leading-relaxed text-white/85 sm:text-lg"
          >
            From laid-back brunch favorites to handcrafted cocktails, find
            something worth gathering around.
          </motion.p>
          <motion.a
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            href="#menu-selections"
            className="mt-8 inline-flex rounded bg-[#f10d05ee] px-7 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Explore the menu
          </motion.a>
        </motion.div>
      </section>

      <div id="menu-selections" className="scroll-mt-6">
        <Menu_card />
      </div>
    </main>
  );
};

export default Menus;
