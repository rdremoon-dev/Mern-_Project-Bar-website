import { useEffect, useState } from 'react';
import eventsFallback from '../data/events';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const normalizeEvent = event => ({
  ...event,
  category: event.category || 'Events',
  desc: event.desc || event.description || '',
  sections: Array.isArray(event.sections) ? event.sections : [],
  highlights: Array.isArray(event.highlights) ? event.highlights : [],
});

export default function useEvents() {
  const [events, setEvents] = useState(eventsFallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/events`);
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const data = await response.json();
        if (!data.success || !Array.isArray(data.events)) {
          throw new Error('The events API returned an invalid response.');
        }
        if (active) setEvents(data.events.map(normalizeEvent));
      } catch (loadError) {
        console.error('Unable to load public events:', loadError);
        if (active) setError('Showing saved events because live events could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEvents();
    return () => {
      active = false;
    };
  }, []);

  return { events, loading, error };
}
