import { useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const BookingForm = ({ compact = false }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '18:00',
    guests: '2',
    area: 'main-bar',
    occasion: 'none',
    requests: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await axios.post(
        `${apiUrl}/api/book-table`,
        formData,
      );

      if (response.data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(response.data.error || 'Unable to submit your request.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrorMessage(
        error.response?.data?.error ||
          'Something went wrong. Please try again later.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={`mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center text-white shadow-2xl ${
          compact ? '' : 'my-20'
        }`}
      >
        <h3 className="text-2xl font-semibold uppercase tracking-wide">
          Request Received
        </h3>
        <p className="mt-2 text-sm text-neutral-400">
          Your reservation is pending staff approval. We’ll email you when it’s
          confirmed.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-lg bg-neutral-800 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
        >
          Book Another Table
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl sm:p-10 ${
        compact ? '' : 'my-20'
      }`}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold uppercase tracking-wide">
          Book a Table
        </h2>
      </div>

      {errorMessage && (
        <p
          className="mb-6 rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-200"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(718) 555-0142"
            className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Party Size *
          </label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="4">4 People</option>
            <option value="6">6 People</option>
            <option value="8">8+ People</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Date *
          </label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            Time Slot *
          </label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="16:00">4:00 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="22:00">10:00 PM</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="area"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-300"
          >
            Seating Area *
          </label>
          <select
            id="area"
            name="area"
            required
            value={formData.area}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="main-bar">Main Bar</option>
            <option value="lounge">Lounge</option>
            <option value="patio">Patio</option>
            <option value="private-room">Private Room</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="occasion"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-300"
          >
            Occasion
          </label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="none">No special occasion</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="business">Business</option>
            <option value="celebration">Celebration</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="requests"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-300"
          >
            Special Requests
          </label>
          <textarea
            id="requests"
            name="requests"
            rows="4"
            value={formData.requests}
            onChange={handleChange}
            placeholder="Let us know about dietary needs, accessibility, or other requests."
            className="mt-2 w-full resize-y rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#C94077] py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-[#b43568] disabled:opacity-50"
        >
          {isSubmitting ? 'Reserving...' : 'Confirm Reservation'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
