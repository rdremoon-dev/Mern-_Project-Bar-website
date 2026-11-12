import { Link } from 'react-router';
import { motion } from 'motion/react';
import useEvents from '../../hooks/useEvents';

const Events = () => {
  const { events: eventsData, loading, error } = useEvents();

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center bg-[#f6e7dc] px-4 py-10 text-gray-600 sm:px-[5vw] sm:py-14 md:px-[5vw] md:py-16 lg:px-[7vw]">
      <div className="mx-auto max-w-7xl ">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-4 text-3xl font-oswald font-semibold uppercase leading-tight text-gray-900 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl text-center py-10"
        >
          Events at Pub &amp; Lounge
        </motion.h2>

        {error && <p role="status" className="mb-4 text-center text-sm text-amber-800">{error}</p>}
        {loading && <p role="status" className="mb-4 text-center text-sm">Loading events…</p>}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {eventsData.map((event, index) => (
            <motion.article
              key={event._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
            >
              <div className="p-5 ">
                {/* Image Header */}
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-800">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Body */}
                <Link to={`/events/${event._id}`} className="block p-6">
                  <span className="text-xs font-semibold tracking-wider text-[#C94077] uppercase">
                    {event.date}
                  </span>
                  <h3 className="mt-2 text-xl font-oswald tracking-wide text-black  group-hover:text-[#b43568] transition-colors uppercase font-medium">
                    {event.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-800 line-clamp-3 font-open-sans leading-6.5">
                    {event.desc}
                  </p>
                </Link>
              </div>

              {/* Card Footer / Call to Action */}
              <div className="p-6 pt-0">
                <Link
                  to={`/events/${event._id}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#C94077] px-4 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-[#b43568]"
                >
                  View event
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
