import { motion } from 'motion/react';
import { Link } from 'react-router';

import footerBanner from '../assets/newsletter.jpg'


const Footer = () => (
  <footer>
    <section
      aria-labelledby="footer-cta-title"
      className="relative isolate flex min-h-96 items-center justify-center overflow-hidden   py-16 text-center sm:min-h-112 sm:px-8 px-4 max-sm:px-[5vw] md:px-[5vw] lg:px-[7vw]"
      style={{ backgroundImage: `url(${footerBanner})` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <motion.div
        className="relative z-10 max-w-2xl text-white"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
          Your next night out
        </p>
        <h2
          id="footer-cta-title"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-oswald uppercase mb-4 font-semibold text-gray-100 leading-tight"
        >
          Good drinks. Great company.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white sm:text-base sm:leading-7">
          Gather your favorite people, explore the menu, and find your next
          reason to celebrate.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#C94077] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b43568] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Reserve a table
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/events" 
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/70 bg-black/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              See upcoming events
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
    <div className="bg-[#1E2329] px-4 max-sm:px-[5vw] md:px-[5vw] lg:px-[7vw] ">
      <div className="flex flex-col md:flex-row items-start justify-center gap-10 py-10 border-b  border-gray-500/30">
        <div className="w-full">
          <Link
            to="/"
            className="shrink-0 font-oswald text-xl font-semibold uppercase text-gray-50"
          >
            Pub Lounge
          </Link>
          <p className="mt-2 text-sm text-gray-100">
            Lorem Ipsum is simply dummy text of the printing and typesetting{' '}
            <br />
            industry. Lorem Ipsum has been.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <a href="#">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.167 2.5a9.1 9.1 0 0 1-2.617 1.275 3.733 3.733 0 0 0-6.55 2.5v.833a8.88 8.88 0 0 1-7.5-3.775s-3.333 7.5 4.167 10.833a9.7 9.7 0 0 1-5.834 1.667C8.333 20 17.5 15.833 17.5 6.25q0-.35-.067-.692A6.43 6.43 0 0 0 19.167 2.5"
                  stroke="#C94077"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15.833c-4.167 1.25-4.167-2.084-5.833-2.5m11.666 5v-3.225a2.8 2.8 0 0 0-.783-2.175c2.616-.292 5.366-1.283 5.366-5.833a4.53 4.53 0 0 0-1.25-3.125 4.22 4.22 0 0 0-.075-3.142s-.983-.292-3.258 1.233a11.15 11.15 0 0 0-5.833 0C5.225.541 4.242.833 4.242.833a4.22 4.22 0 0 0-.075 3.142 4.53 4.53 0 0 0-1.25 3.15c0 4.516 2.75 5.508 5.366 5.833a2.8 2.8 0 0 0-.783 2.15v3.225"
                  stroke="#C94077"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.333 6.667a5 5 0 0 1 5 5V17.5H15v-5.833a1.667 1.667 0 0 0-3.334 0V17.5H8.333v-5.833a5 5 0 0 1 5-5M5 7.5H1.667v10H5zM3.333 5a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"
                  stroke="#C94077"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="w-full flex flex-wrap md:flex-nowrap justify-between">
          <div>
            <h2 className="font-semibold text-gray-50 mb-5">RESOURCES</h2>
            <ul className="text-sm text-gray-500 space-y-2 list-none">
              {[
                { to: '/events', label: 'All Events' },
                { to: '/menu', label: 'Menus' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="transition-colors hover:text-white text-gray-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-gray-50 mb-5">RESOURCES</h2>
            <ul className="text-sm text-gray-500 space-y-2 list-none">
              {[
                { to: '/events', label: 'All Events' },
                { to: '/menu', label: 'Menus' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="transition-colors hover:text-white text-gray-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-gray-50 mb-5">HOURS</h2>
            <div className="text-sm text-gray-100 space-y-2 list-none">
              <li>Mon-Thu: 3pm-12am</li>
              <li>Fri-Sat: 12pm-3am</li>
              <li>Sun: 12pm-12am</li>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-gray-100">
        Copyright 2026 © <a href="https://www.linkedin.com/in/rdremoon/">RD Remoon</a>. All
        Right Reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
