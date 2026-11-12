import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router';
import contactBanner from '../assets/contact.jpg';
import BookingForm from '../model/BookingForm';

const openingHours = [
  { days: 'Monday – Thursday', hours: '3pm – 12am' },
  { days: 'Friday – Saturday', hours: '12pm – 3am' },
  { days: 'Sunday', hours: '12pm – 12am' },
];

const Contact = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    requestAnimationFrame(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [hash]);

  return (
    <main>
    <section
      id="contact-hero"
      aria-labelledby="contact-hero-title"
      className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-cover bg-center px-4 pb-12 pt-28 text-center sm:px-[5vw] sm:pt-32"
      style={{ backgroundImage: `url(${contactBanner})` }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 max-w-3xl text-white">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-sm"
        >
          We’d love to hear from you
        </motion.p>
        <motion.h1
          id="contact-hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
          className="font-oswald text-4xl font-semibold uppercase leading-tight text-white sm:text-5xl md:text-6xl"
        >
          Visit Pub &amp; Lounge
        </motion.h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
          Get in touch, plan your visit, or reserve a table for your next night
          out.
        </p>
      </div>
    </section>

    <section
      aria-labelledby="contact-details-title"
      className="bg-[#f6e7dc] px-4 py-12 sm:px-[5vw] sm:py-16 lg:px-[7vw]"
    >
      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)] xl:gap-12">
        <aside className="rounded-2xl border p-6 text-gray-900 shadow-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C94077]">
            Find us
          </p>
          <h2
            id="contact-details-title"
            className="mt-2 font-oswald text-2xl font-semibold uppercase sm:text-3xl"
          >
            Make yourself at home
          </h2>

          <div className="mt-8 space-y-7">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                Address
              </h3>
              <address className="mt-2 not-italic leading-6 text-gray-900 font-open-sans">
                123 Demo Road (56th &amp; 1st Avenue)
                <br />
                New York, NY 10017, USA
              </address>
            </div>
            <hr/>
            <div className=" pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                General inquiries
              </h3>
              <a
                href="tel:+14065550120"
                className="mt-2 inline-flex text-lg font-medium text-gray-900 transition-colors hover:text-[#e06b98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C94077]"
              >
                (406) 555-0120
              </a>
            </div>
            <hr />
            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                Opening hours
              </h3>
              <dl className="mt-3 space-y-3">
                {openingHours.map(({ days, hours }) => (
                  <div
                    key={days}
                    className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm"
                  >
                    <dt className="text-gray-900">{days}</dt>
                    <dd className="font-medium text-gray-900">{hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>

        <div id="booking-form" className="scroll-mt-24">
          <BookingForm compact />
        </div>
      </div>
    </section>
    </main>
  );
};

export default Contact;
