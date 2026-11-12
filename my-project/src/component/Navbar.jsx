import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about#about-hero', label: 'About' },
  { to: '/menu#menu-hero', label: 'Menus' },
  { to: '/contact#contact-hero', label: 'Contact' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isBookingPage = useLocation().pathname === '/booking-form';

  const linkClassName = ({ isActive }) =>
    `block py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-red-400 ${
      isActive ? 'text-red-400' : 'text-white'
    }`;

  return (
    <header
      className={`absolute inset-x-0 top-0 z-20 px-4 max-sm:px-[5vw] md:px-[5vw] lg:px-[7vw] ${
        isBookingPage ? 'bg-black' : ''
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="relative flex min-h-20 items-center justify-between gap-6"
      >
        <Link
          to="/"
          className="shrink-0 font-oswald text-xl font-semibold uppercase text-white"
          onClick={() => setMenuOpen(false)}
        >
          Pub Lounge
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={linkClassName}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 items-center">
          <Link
            to="/contact#booking-form"
            className="inline-flex shrink-0 rounded bg-[#f10d05ee] px-3 py-2 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:shadow sm:px-5 sm:py-3 sm:text-sm"
          >
            Reserve a table
          </Link>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded border border-white/40 text-white md:hidden"
            aria-label={
              menuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(isOpen => !isOpen)}
          >
            <svg
              aria-hidden="true"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {menuOpen ? (
                <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              id="mobile-navigation"
              className="absolute 
            w-full transition-all duration-300 top-full rounded-b bg-black/95 p-5 shadow-lg md:hidden"
            >
              <ul className="flex flex-col">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={linkClassName}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
