import { motion } from 'motion/react';
import about_banner from '../../assets/about-banner.jpg'
const Hero = () => {
  return (
   <div
         className="relative flex min-h-[80vh] items-center justify-center bg-cover bg-top px-4 sm:px-[5vw] md:px-[5vw] lg:px-[7vw] py-5"
         style={{ backgroundImage: `url(${about_banner})` }}
       >
         {/* Overlay */}
         <div className="absolute inset-0 bg-black/70"></div>
         <motion.h1
           initial={{ opacity: 0, y: 24 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.65, ease: 'easeOut', delay: 0.12 }}
           className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-oswald uppercase mt-3 mb-2 font-semibold text-gray-50 leading-tight sm:leading-tight"
         >
           About Us
         </motion.h1>
       </div>
  )
}

export default Hero
