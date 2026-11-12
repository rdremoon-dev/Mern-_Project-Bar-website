import { motion } from 'motion/react';
import Menu_card from './Menu_card'
const Menu_section = () => {
  return (
    <div className="text-gray-600 relative flex flex-col min-h-[50vh] items-center justify-center bg-cover bg-top px-4 sm:px-[5vw] md:px-[5vw] lg:px-[7vw] py-16 bg-[#FBF7F4] max-sm:py-4">
      <motion.div
        className="w-full flex flex-col justify-center md:items-center md:text-left items-center text-center mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
      >
        <motion.span
          initial={{ letterSpacing: '0.2em' }}
          whileInView={{ letterSpacing: '0.32em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[16px] text-[#C94077] tracking-[5px] font-medium uppercase mb-2"
        >
          our menu
        </motion.span>

        <h1 className="text-3xl max-sm:text-2xl max-md:text-4xl lg:text-5xl xl:text-5xl font-oswald uppercase mb-12 font-semibold text-gray-900 leading-tight text-center max-sm:mb-4">
          Great Food. Amazing Craft Beer.
        </h1>
      </motion.div>
      <Menu_card />
    </div>
  );
}

export default Menu_section
