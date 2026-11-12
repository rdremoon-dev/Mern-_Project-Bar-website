import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import useEvents from '../hooks/useEvents';

const EventDetails = () => {
  const { id } = useParams();
  const { events, loading, error } = useEvents();
  const event = events.find(item => String(item._id) === id);

  if (loading && !event) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FBF7F4] px-4 py-20">
        <p role="status" className="text-gray-600">Loading event…</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FBF7F4] px-4 py-20">
        <div className="max-w-lg text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C94077]">
            Event not found
          </p>
          <h1 className="mt-3 font-oswald text-3xl font-semibold uppercase text-gray-900 sm:text-4xl">
            We couldn’t find that event
          </h1>
          <p className="mt-4 text-gray-600">
            It may have been removed, or the link may be incorrect.
          </p>
          <Link
            to="/events"
            className="mt-8 inline-flex rounded-md bg-[#C94077] px-5 py-3 font-medium text-white transition-colors hover:bg-[#b43568] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077]"
          >
            Browse all events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FBF7F4]">
      {error && (
        <p role="status" className="px-4 pt-4 text-center text-sm text-amber-800">
          {error}
        </p>
      )}
      <section className="relative flex min-h-[65vh] items-end overflow-hidden bg-neutral-950 px-4 pb-12 pt-32 sm:px-8 sm:pb-16 md:min-h-[72vh] lg:px-[7vw]">
        <img
          src={event.image}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60" />

        <motion.div
          className="relative z-10 mx-auto w-full max-w-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span aria-hidden="true">&larr;</span>
            All events
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-pink-200">
            Pub &amp; Lounge events
          </p>
          <h1 className="mt-3 max-w-4xl font-oswald text-4xl font-semibold uppercase leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {event.title}
          </h1>
          <p className="mt-5 inline-flex rounded-full border border-white/30 bg-black/25 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            {event.date}
          </p>
        </motion.div>
      </section>

      <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-[7vw] lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-16">
          <motion.article
            className="max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C94077]">
              The story
            </p>
            <h2 className="mt-3 font-oswald text-2xl font-semibold uppercase text-gray-900 sm:text-3xl">
              {event.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
              {event.desc}
            </p>

            {event.sections.length > 0 && (
              <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12">
              {event.sections.map(section => (
                <section key={section.heading}>
                  <h3 className="font-oswald text-xl font-semibold uppercase text-gray-900 sm:text-2xl">
                    {section.heading}
                  </h3>
                  <div className="mt-4 space-y-4 text-base leading-7 text-gray-700">
                    {section.paragraphs.map(paragraph => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.points && (
                    <ul className="mt-5 space-y-3">
                      {section.points.map(point => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-2 shrink-0 rounded-full bg-[#C94077]"
                          />
                          <span className="leading-7">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              </div>
            )}
          </motion.article>

          <motion.aside
            className="h-fit rounded-2xl border border-[#eadbd2] bg-white p-6 shadow-sm sm:p-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C94077]">
              At a glance
            </p>
            <dl className="mt-5">
              <dt className="text-sm text-gray-500">Date</dt>
              <dd className="mt-1 font-medium text-gray-900">{event.date}</dd>
              {event.time && (
                <>
                  <dt className="mt-4 text-sm text-gray-500">Time</dt>
                  <dd className="mt-1 font-medium text-gray-900">{event.time}</dd>
                </>
              )}
              {event.price !== undefined && (
                <>
                  <dt className="mt-4 text-sm text-gray-500">Entry</dt>
                  <dd className="mt-1 font-medium text-gray-900">${event.price}</dd>
                </>
              )}
            </dl>
            {event.highlights.length > 0 && (
            <div className="mt-6 border-t border-[#eadbd2] pt-6">
              <h3 className="font-oswald text-lg font-semibold uppercase text-gray-900">
                Highlights
              </h3>
              <ul className="mt-4 space-y-3">
                {event.highlights.map(highlight => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm leading-6 text-gray-700"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-[#C94077]"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            )}
            <Link
              to="/contact"
              className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-[#C94077] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#b43568] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077]"
            >
              Reserve a table
            </Link>
            <Link
              to="/events"
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-[#eadbd2] px-5 py-3 text-center text-sm font-semibold text-gray-800 transition-colors hover:bg-[#FBF7F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077]"
            >
              Explore more events
            </Link>
          </motion.aside>
        </div>
      </section>
    </main>
  );
};

export default EventDetails;
