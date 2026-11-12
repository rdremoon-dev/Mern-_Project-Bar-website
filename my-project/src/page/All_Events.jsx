import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import useEvents from '../hooks/useEvents';

const All_Events = () => {
  const { events, loading, error } = useEvents();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All events');
  const [sortOrder, setSortOrder] = useState('soonest');

  const categories = useMemo(
    () => ['All events', ...new Set(events.map(event => event.category))],
    [events],
  );

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return events
      .filter(event => {
        const matchesCategory =
          category === 'All events' || event.category === category;
        const searchableText =
          `${event.title} ${event.desc} ${event.category} ${event.date}`.toLowerCase();
        return matchesCategory && (!query || searchableText.includes(query));
      })
      .sort((a, b) => {
        const dateDifference = new Date(a.date) - new Date(b.date);
        return sortOrder === 'latest' ? -dateDifference : dateDifference;
      });
  }, [category, events, searchQuery, sortOrder]);

  const clearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setCategory('All events');
    setSortOrder('soonest');
  };

  return (
    <main className="min-h-screen bg-[#FBF7F4]">
      <section className="bg-neutral-950 px-4 pb-12 pt-32 text-white sm:px-8 sm:pb-16 lg:px-[7vw]">
        <div className="mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-200"
          >
            Pub &amp; Lounge
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-3 font-oswald text-4xl font-semibold uppercase leading-tight sm:text-5xl md:text-6xl"
          >
            All Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7"
          >
            Find a night that sounds like you. Search our event collection or
            browse by category.
          </motion.p>
        </div>
      </section>

      <section
        aria-label="Find events"
        className="px-4 py-8 sm:px-8 sm:py-10 lg:px-[7vw]"
      >
        <div className="mx-auto max-w-7xl">
          <form
            className="grid gap-3 rounded-2xl border border-[#eadbd2] bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:p-5"
            onSubmit={event => {
              event.preventDefault();
              setSearchQuery(searchInput);
            }}
            role="search"
          >
            <label className="flex min-w-0 items-center gap-3 rounded-lg border border-[#eadbd2] px-4 focus-within:border-[#C94077] focus-within:ring-2 focus-within:ring-[#C94077]/20">
              <svg
                aria-hidden="true"
                className="size-5 shrink-0 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <span className="sr-only">Search events</span>
              <input
                type="search"
                value={searchInput}
                onChange={event => setSearchInput(event.target.value)}
                placeholder="Search events, music, workshops..."
                className="min-h-12 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
              />
            </label>
            <button
              type="submit"
              className="min-h-12 rounded-lg bg-[#C94077] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#b43568] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077]"
            >
              Search events
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Browse by category
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map(item => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077] ${
                      category === item
                        ? 'border-[#C94077] bg-[#C94077] text-white'
                        : 'border-[#eadbd2] bg-white text-gray-700 hover:border-[#C94077] hover:text-[#b43568]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex shrink-0 items-center gap-3 text-sm text-gray-600">
              <span>Sort by</span>
              <select
                value={sortOrder}
                onChange={event => setSortOrder(event.target.value)}
                className="min-h-11 rounded-lg border border-[#eadbd2] bg-white px-3 text-sm text-gray-900 focus:border-[#C94077] focus:outline-none focus:ring-2 focus:ring-[#C94077]/20"
              >
                <option value="soonest">Date: earliest first</option>
                <option value="latest">Date: latest first</option>
              </select>
            </label>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-b border-[#eadbd2] pb-4">
            <p className="text-sm text-gray-600" aria-live="polite">
              <span className="font-semibold text-gray-900">
                {filteredEvents.length}
              </span>{' '}
              {filteredEvents.length === 1 ? 'event' : 'events'} found
            </p>
            {(searchQuery || category !== 'All events' || sortOrder !== 'soonest') && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-[#b43568] underline decoration-transparent underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077]"
              >
                Clear filters
              </button>
            )}
          </div>

          {error && (
            <p role="status" className="mt-5 text-sm text-amber-800">
              {error}
            </p>
          )}

          {loading && (
            <p role="status" className="py-6 text-sm text-gray-600">
              Loading events…
            </p>
          )}

          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => (
                <motion.article
                  key={event._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#eadbd2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    to={`/events/${event._id}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C94077]"
                    aria-label={`View ${event.title}`}
                  >
                    <img
                      src={event.image}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#b43568]">
                      {event.category}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C94077]">
                      {event.date}
                    </p>
                    <h2 className="mt-2 font-oswald text-2xl font-semibold uppercase leading-tight text-gray-900">
                      {event.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
                      {event.desc}
                    </p>
                    <Link
                      to={`/events/${event._id}`}
                      className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#C94077] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b43568] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077]"
                    >
                      View event
                      <span className="ml-2" aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </motion.article>
              ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="my-8 rounded-2xl border border-dashed border-[#d7c3b8] bg-white px-5 py-14 text-center">
              <h2 className="font-oswald text-2xl font-semibold uppercase text-gray-900">
                No events match your search
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Try another search term or clear your filters to see all events.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg border border-[#C94077] px-5 py-2.5 text-sm font-semibold text-[#b43568] transition-colors hover:bg-[#C94077] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077]"
              >
                Show all events
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default All_Events;
