import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getLocalTimeZone, today } from '@internationalized/date';
import defaultAdminAvatar from '../assets/profile-img.jpeg';


const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const maxAvatarSize = 2 * 1024 * 1024;
const allowedAvatarTypes = new Set([
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const getAvatarSrc = avatar =>
  avatar?.startsWith('data:image/') ||
  avatar?.startsWith('https://') ||
  avatar?.startsWith('http://')
    ? avatar
    : defaultAdminAvatar;

const STAGES = {
  pending: {
    label: 'Pending',
    pill: 'inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-amber-800 ring-1 ring-amber-600/20 ring-inset dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
    dot: 'size-1.5 rounded-full bg-amber-500',
  },
  confirmed: {
    label: 'Confirmed',
    pill: 'inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
    dot: 'size-1.5 rounded-full bg-green-500',
  },
  cancelled: {
    label: 'Cancelled',
    pill: 'inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-red-700 ring-1 ring-red-600/20 ring-inset dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
    dot: 'size-1.5 rounded-full bg-red-500',
  },
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const capitalizeName = name => {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const csvCell = value => {
  const text = String(value ?? '');
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
};

const exportBookings = bookings => {
  const columns = [
    ['Name', booking => booking.name],
    ['Email', booking => booking.email],
    ['Phone', booking => booking.phone],
    ['Date', booking => booking.date],
    ['Time', booking => booking.time],
    ['Guests', booking => booking.guests],
    ['Seating', booking => booking.area],
    ['Occasion', booking => booking.occasion],
    ['Special requests', booking => booking.requests],
    ['Status', booking => booking.status],
    ['Created at', booking => booking.createdAt],
  ];
  const csv = [
    columns.map(([label]) => csvCell(label)).join(','),
    ...bookings.map(booking =>
      columns.map(([, getValue]) => csvCell(getValue(booking))).join(','),
    ),
  ].join('\r\n');
  const url = URL.createObjectURL(
    new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `pub-lounge-reservations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default function AdminDashboard() {
  const [drawer, setDrawer] = useState(false);
  const sideRef = useRef(null);
  const openerRef = useRef(null);
  const closerRef = useRef(null);
  const opened = useRef(false);

  // Active Tab View: 'reservations', 'events', or 'menus'
  const [currentView, setCurrentView] = useState('reservations');

  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', drawer);
    if (drawer) closerRef.current?.focus();
    else if (opened.current) openerRef.current?.focus();
    opened.current = drawer || opened.current;
    if (!drawer) return undefined;
    const wide = window.matchMedia('(min-width: 64rem)');
    const onWide = () => {
      if (wide.matches) setDrawer(false);
    };
    wide.addEventListener('change', onWide);
    return () => {
      wide.removeEventListener('change', onWide);
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [drawer]);

  const onShellKey = event => {
    if (!drawer) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setDrawer(false);
    } else if (event.key === 'Tab') {
      const items = [
        ...sideRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled])',
        ),
      ].filter(el => el.tabIndex >= 0 && el.getClientRects().length > 0);
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const dialog = drawer
    ? { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Menu' }
    : {};

  // Admin Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('pub_admin_profile');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Reservation Manager',
          email: 'staff@publounge.com',
          avatar: 'https://readymadeui.com/team-2.webp',
        };
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const handleAvatarUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedAvatarTypes.has(file.type)) {
      setProfileError('Choose a PNG, JPEG, WebP, or GIF image.');
      e.target.value = '';
      return;
    }

    if (file.size > maxAvatarSize) {
      setProfileError('The profile image must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }

    setProfileError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setTempProfile(prev => ({ ...prev, avatar: reader.result }));
      }
    };
    reader.onerror = () => setProfileError('Could not read the selected image.');
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async e => {
    e.preventDefault();
    setProfileError('');

    let savedProfile = tempProfile;
    if (tempProfile.avatar !== profile.avatar) {
      const token = localStorage.getItem('pub_admin_token');
      if (!token) {
        setProfileError('Your admin session expired. Please sign in again.');
        return;
      }

      setSavingProfile(true);
      try {
        const { data } = await axios.put(
          `${apiUrl}/api/admin/profile`,
          { avatar: tempProfile.avatar },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!data.success || !data.admin?.avatar) {
          throw new Error('The server did not save the profile image.');
        }

        savedProfile = { ...tempProfile, avatar: data.admin.avatar };
      } catch (error) {
        setProfileError(
          error.response?.data?.error ||
            error.message ||
            'Failed to save the profile image.',
        );
        setSavingProfile(false);
        return;
      }
      setSavingProfile(false);
    }

    setProfile(savedProfile);
    localStorage.setItem('pub_admin_profile', JSON.stringify(savedProfile));
    setIsProfileOpen(false);
  };

  // Data States
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [menus, setMenus] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingIds, setUpdatingIds] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Add Item Modals State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', category: 'Events', time: '', description: '', price: '', image: '' });
  const [eventDate, setEventDate] = useState(() =>
    today(getLocalTimeZone()).toString(),
  );
  const [savingEvent, setSavingEvent] = useState(false);

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuCategory, setMenuCategory] = useState('Cocktails');
  const [menuItems, setMenuItems] = useState([
    { name: '', price: '', description: '' },
  ]);
  const [menuImage, setMenuImage] = useState('');
  const [savingMenu, setSavingMenu] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const [bookRes, eventRes, menuRes] = await Promise.all([
        axios.get(`${apiUrl}/api/bookings?_t=${Date.now()}`).catch(error => {
          console.error('Error fetching reservations:', error);
          return null;
        }),
        axios.get(`${apiUrl}/api/events?_t=${Date.now()}`).catch(error => {
          console.error('Error fetching events:', error);
          return null;
        }),
        axios.get(`${apiUrl}/api/menus?_t=${Date.now()}`).catch(error => {
          console.error('Error fetching menu items:', error);
          return null;
        }),
      ]);

      const unavailable = [];
      if (bookRes?.data?.success) setBookings(bookRes.data.bookings || []);
      else unavailable.push('reservations');
      if (eventRes?.data?.success) setEvents(eventRes.data.events || []);
      else unavailable.push('events');
      if (menuRes?.data?.success) setMenus(menuRes.data.menus || []);
      else unavailable.push('menu items');
      if (unavailable.length) {
        setLoadError(`Unable to load ${unavailable.join(', ')}. Check the backend connection and refresh.`);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoadError('Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The initial request owns the dashboard's loading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // Handlers for Events & Menus
  const handleEventFile = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewEvent(p => ({ ...p, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleMenuFile = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMenuImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEvent = async e => {
    e.preventDefault();
    try {
      setSavingEvent(true);
      setActionError('');
      const res = await axios.post(`${apiUrl}/api/events`, {
        ...newEvent,
        date: eventDate.toString(),
      });
      if (!res.data.success || !res.data.event) {
        throw new Error(res.data.error || 'The server did not save the event.');
      }
      setEvents(prev => [res.data.event, ...prev]);
      setIsEventModalOpen(false);
      setNewEvent({ title: '', category: 'Events', time: '', description: '', price: '', image: '' });
      setEventDate(today(getLocalTimeZone()).toString());
    } catch (err) {
      setActionError(
        err.response?.data?.error || err.message || 'Failed to create event.',
      );
    } finally {
      setSavingEvent(false);
    }
  };

  const handleCreateMenu = async e => {
    e.preventDefault();
    try {
      setSavingMenu(true);
      setActionError('');
      const res = await axios.post(`${apiUrl}/api/menus`, {
        category: menuCategory,
        image: menuImage,
        items: menuItems,
      });
      if (!res.data.success || !Array.isArray(res.data.menus)) {
        throw new Error('The server did not save the menu items.');
      }

      setMenus(prev => [...res.data.menus, ...prev]);
      setIsMenuModalOpen(false);
      setMenuCategory('Cocktails');
      setMenuItems([{ name: '', price: '', description: '' }]);
      setMenuImage('');
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to add menu item.');
    } finally {
      setSavingMenu(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setActionError('');
      setUpdatingIds(prev => [...prev, id]);
      const res = await axios.patch(`${apiUrl}/api/bookings/${id}/status`, { status: newStatus });
      if (!res.data.success) throw new Error();
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, ...res.data.booking } : b)));
    } catch {
      setActionError('Failed to update booking status.');
    } finally {
      setUpdatingIds(prev => prev.filter(item => item !== id));
    }
  };

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return;
    const id = bookingToDelete._id;
    try {
      setDeletingIds(prev => [...prev, id]);
      await axios.delete(`${apiUrl}/api/bookings/${id}`);
      setBookings(prev => prev.filter(item => item._id !== id));
      setBookingToDelete(null);
    } catch {
      setActionError('Failed to delete reservation.');
    } finally {
      setDeletingIds(prev => prev.filter(item => item !== id));
    }
  };

  const visibleBookings = bookings.filter(
    b =>
      (statusFilter === 'all' || b.status === statusFilter) &&
      (!query.trim() || `${b.name} ${b.email} ${b.phone}`.toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <div
      id="dl-crm"
      onKeyDown={onShellKey}
      className="flex min-h-dvh bg-[#f6e7dc] text-neutral-900  dark:text-gray-300 font-sans relative overflow-x-hidden"
    >
      {/* Sidebar Navigation */}
      <div
        ref={sideRef}
        id="dl-crm-side"
        data-open={drawer ? '' : undefined}
        {...dialog}
        className="flex-col transition-transform duration-300 ease-out max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:hidden max-lg:w-72 max-lg:bg-neutral-100 max-lg:shadow-2xl max-lg:data-open:flex lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 dark:max-lg:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 bg-[#f6e7dc] dark:bg-[#071B2B]"
      >
        <div className="flex items-center gap-1 px-3 pt-3">
          <div className="relative flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-2 hover:bg-neutral-950/5 dark:hover:bg-neutral-900">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
              P
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-left text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                Pub & Lounge
              </span>
              <span className="block truncate text-xs text-gray-300 dark:text-neutral-400">
                Admin Portal
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
            className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 lg:hidden dark:text-neutral-400"
          >
            ✕
          </button>
        </div>

        <nav
          aria-label="Main"
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3"
        >
          <div className="px-2 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-50">
            Workspace
          </div>
          <ul className="flex flex-col gap-0.5">
            <li>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('reservations');
                  setDrawer(false);
                }}
                className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm font-medium cursor-pointer ${
                  currentView === 'reservations'
                    ? 'bg-white text-neutral-950 shadow-xs ring-1 ring-neutral-950/5 dark:bg-[#071B2B] dark:text-neutral-50 dark:ring-neutral-800'
                    : 'text-neutral-600 hover:bg-neutral-950/5 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                <span>📅</span>
                <span className="truncate">Reservations</span>
                <span className="ml-auto text-xs tabular-nums text-gray-300">
                  {bookings.length}
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('events');
                  setDrawer(false);
                }}
                className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm font-medium cursor-pointer ${
                  currentView === 'events'
                    ? 'bg-white text-neutral-950 shadow-xs ring-1 ring-neutral-950/5 dark:bg-[#071B2B] dark:text-neutral-50 dark:ring-neutral-800'
                    : 'text-neutral-600 hover:bg-neutral-950/5 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                <span>🎉</span>
                <span className="truncate">Manage Events</span>
                <span className="ml-auto text-xs tabular-nums text-gray-300">
                  {events.length}
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('menus');
                  setDrawer(false);
                }}
                className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm font-medium cursor-pointer ${
                  currentView === 'menus'
                    ? 'bg-white text-neutral-950 shadow-xs ring-1 ring-neutral-950/5 dark:bg-[#071B2B] dark:text-neutral-50 dark:ring-neutral-800'
                    : 'text-neutral-600 hover:bg-neutral-950/5 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                <span>🍸</span>
                <span className="truncate">Manage Menu</span>
                <span className="ml-auto text-xs tabular-nums text-gray-300">
                  {menus.length}
                </span>
              </button>
            </li>
          </ul>

          <div className="mt-auto rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-500 dark:bg-[#071B2B] shadow-blue-950">
            <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Data backup
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-300 dark:text-neutral-300">
              Export bookings for spreadsheet reports.
            </p>
            <button
              type="button"
              onClick={() => exportBookings(bookings)}
              disabled={bookings.length === 0}
              className="mt-3 w-full rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:text-[#071B2B] hover:bg-gray-50 dark:bg-[#C94077] dark:text-gray-50 cursor-pointer transition-colors duration-500 ease-in-out"
            >
              Export CSV
            </button>
          </div>
        </nav>

        {/* Manager Profile */}
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={() => {
              setTempProfile(profile);
              setIsProfileOpen(true);
            }}
            className="w-full flex items-center gap-2.5 rounded-lg p-2 hover:bg-neutral-200/60 dark:hover:bg-neutral-900 text-left transition-colors cursor-pointer border border-transparent hover:border-neutral-300 dark:hover:border-neutral-800"
          >
            <img
              src={getAvatarSrc(profile.avatar)}
              alt="Avatar"
              className="size-8 shrink-0 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-neutral-950 dark:text-neutral-50">
                {profile.name}
              </span>
              <span className="block truncate text-xs text-gray-300 dark:text-neutral-400">
                {profile.email}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col w-full overflow-x-hidden lg:ml-64">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-neutral-200 px-4 sm:px-6 lg:px-8 dark:border-neutral-800 bg-white dark:bg-[#071B2B] sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="relative -ml-2 inline-flex size-9 items-center justify-center rounded-lg text-neutral-600 lg:hidden dark:text-neutral-400"
            >
              ☰
            </button>
            <h1 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
              {currentView === 'reservations' && 'Table Reservations'}
              {currentView === 'events' && 'Events Manager'}
              {currentView === 'menus' && 'Menu Items Manager'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {currentView === 'events' && (
              <button
                onClick={() => {
                  setActionError('');
                  setIsEventModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold cursor-pointer"
              >
                + Add Event
              </button>
            )}
            {currentView === 'menus' && (
              <button
                onClick={() => {
                  setActionError('');
                  setIsMenuModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold cursor-pointer"
              >
                + Add Menu Item
              </button>
            )}
            <button
              onClick={fetchData}
              className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs font-medium cursor-pointer"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full">
          {loadError && (
            <div
              role="alert"
              className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200"
            >
              {loadError}
            </div>
          )}
          {actionError && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-800 dark:bg-red-950 dark:text-red-200">
              {actionError}
            </div>
          )}

          {/* VIEW 1: RESERVATIONS */}
          {currentView === 'reservations' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setStatusFilter(f.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap ${
                        statusFilter === f.key
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                          : 'bg-neutral-200/70 text-neutral-600 hover:bg-[#C94077] dark:bg-[#071B2B] dark:text-neutral-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search reservations..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full sm:w-72 rounded-lg bg-white dark:bg-[#071B2B] px-3 py-1.5 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800 inset shadow-lg shadow-[#071B2B]-500/50 "
                />
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-[#071B2B] overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-175">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-gray-300 bg-[#f6e7dc] dark:bg-[#071B2B]/50">
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Date & Time</th>
                        <th className="p-3.5">Guests</th>
                        <th className="p-3.5">Seating & Occasion</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
                      {visibleBookings.map(b => {
                        const stageInfo = STAGES[b.status] || STAGES.pending;
                        const isUpdating = updatingIds.includes(b._id);
                        const isDeleting = deletingIds.includes(b._id);
                        const actionsDisabled = isUpdating || isDeleting;
                        return (
                          <tr
                            key={b._id}
                            className="hover:bg-[#f6e7dc]/50 dark:hover:bg-neutral-900/50"
                          >
                            <td className="p-3.5">
                              <div className="font-medium text-neutral-900 dark:text-white">
                                {capitalizeName(b.name)}
                              </div>
                              <div className="text-xs text-gray-300">
                                {b.email} &bull; {b.phone}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-neutral-900 dark:text-neutral-200">
                                {b.date}
                              </div>
                              <div className="text-xs text-gray-300">
                                {b.time}
                              </div>
                            </td>
                            <td className="p-3.5 font-medium">
                              {b.guests} Guests
                            </td>
                            <td className="p-3.5">
                              <div className="capitalize">
                                {b.area?.replace('-', ' ')}
                              </div>
                              <div className="text-xs text-gray-300 capitalize">
                                {b.occasion || 'None'}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className={stageInfo.pill}>
                                <span className={stageInfo.dot} />
                                {stageInfo.label}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              {b.status !== 'confirmed' && (
                                <button
                                  onClick={() =>
                                    updateStatus(b._id, 'confirmed')
                                  }
                                  disabled={actionsDisabled}
                                  className="px-2 py-1 bg-green-600 text-white text-xs rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isUpdating ? 'Updating…' : 'Approve'}
                                </button>
                              )}
                              {b.status !== 'cancelled' && (
                                <button
                                  onClick={() =>
                                    updateStatus(b._id, 'cancelled')
                                  }
                                  disabled={actionsDisabled}
                                  className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 text-xs rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isUpdating ? 'Updating…' : 'Cancel'}
                                </button>
                              )}
                              <button
                                onClick={() => setBookingToDelete(b)}
                                disabled={actionsDisabled}
                                className="px-2 py-1 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 text-xs rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isDeleting ? 'Deleting…' : 'Delete'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: EVENTS MANAGER */}
          {currentView === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(ev => (
                <div
                  key={ev._id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#071B2B] overflow-hidden flex flex-col"
                >
                  {ev.image && (
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {ev.date} at {ev.time}
                    </span>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-gray-300 dark:text-neutral-400 mt-2 flex-1">
                      {ev.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        ${ev.price}
                      </span>
                      <button
                        onClick={async () => {
                          await axios.delete(`${apiUrl}/api/events/${ev._id}`);
                          setEvents(prev => prev.filter(e => e._id !== ev._id));
                        }}
                        className="px-2.5 py-1 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300 text-xs rounded font-medium cursor-pointer"
                      >
                        Delete Event
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 3: MENUS MANAGER */}
          {currentView === 'menus' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(
                menus.reduce((acc, item) => {
                  const cat = item.category || 'Cocktails';
                  if (!acc[cat]) {
                    acc[cat] = {
                      category: cat,
                      image: item.image,
                      items: [],
                    };
                  }
                  acc[cat].items.push(item);
                  return acc;
                }, {}),
              ).map(group => (
                <div
                  key={group.category}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#071B2B] overflow-hidden flex flex-col shadow-sm"
                >
                  {/* Shared Category Image */}
                  {group.image && (
                    <img
                      src={group.image}
                      alt={group.category}
                      className="w-full h-44 object-cover"
                    />
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {/* Category Header */}
                    <h3 className="font-bold text-neutral-900 dark:text-white text-lg uppercase tracking-wider pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3 text-[#C94077]">
                      {group.category}
                    </h3>

                    {/* List of Items under this Category */}
                    <div className="space-y-4 flex-1 divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800">
                      {group.items.map(item => (
                        <div key={item._id} className="pt-3 first:pt-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
                                {item.name}
                              </h4>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-gray-50 whitespace-nowrap">
                              ${item.price}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={async () => {
                                await axios.delete(
                                  `${apiUrl}/api/menus/${item._id}`,
                                );
                                setMenus(prev =>
                                  prev.filter(m => m._id !== item._id),
                                );
                              }}
                              className="text-[11px] px-2 py-0.5 bg-red-50 text-red-600 dark:bg-red-900 dark:text-gray-50 rounded hover:opacity-80 cursor-pointer font-medium"
                            >
                              Remove Item
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-booking-title"
            className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-[#071B2B]"
          >
            <h2
              id="delete-booking-title"
              className="text-lg font-bold text-neutral-900 dark:text-white"
            >
              Delete reservation?
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              This will permanently delete the reservation for{' '}
              {capitalizeName(bookingToDelete.name)}.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                disabled={deletingIds.includes(bookingToDelete._id)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteBooking}
                disabled={deletingIds.includes(bookingToDelete._id)}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingIds.includes(bookingToDelete._id)
                  ? 'Deleting…'
                  : 'Delete reservation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD EVENT */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white dark:bg-[#071B2B] rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Add New Event
            </h2>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={e =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="w-full rounded-lg bg-[#f6e7dc] dark:bg-[#071B2B] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800"
              required
            />
            <select
              aria-label="Event category"
              value={newEvent.category}
              onChange={e =>
                setNewEvent({ ...newEvent, category: e.target.value })
              }
              className="w-full rounded-lg bg-[#f6e7dc] dark:bg-[#071B2B] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800"
            >
              <option value="Events">Events</option>
              <option value="Live music">Live music</option>
              <option value="Workshops">Workshops</option>
              <option value="Special events">Special events</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              {/* Date */}
              <div className="flex flex-col w-full bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm transition-all focus-within:border-primary">
                <label
                  htmlFor="date"
                  className="text-xs text-gray-300 mb-1 font-medium"
                >
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  min={today(getLocalTimeZone()).toString()}
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full text-sm sm:text-base text-white bg-transparent outline-none cursor-pointer scheme-dark"
                  required
                />
              </div>
              <input
                type="time"
                value={newEvent.time}
                onChange={e =>
                  setNewEvent({ ...newEvent, time: e.target.value })
                }
                className="rounded-lg bg-[#f6e7dc] dark:bg-[#071B2B] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800"
                required
              />
            </div>
            <input
              type="number"
              placeholder="Ticket Price / Entry Fee ($)"
              value={newEvent.price}
              onChange={e =>
                setNewEvent({ ...newEvent, price: e.target.value })
              }
              className="w-full rounded-lg bg-[#f6e7dc] dark:bg-[#071B2B] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800"
              required
            />
            <textarea
              placeholder="Event Description..."
              value={newEvent.description}
              onChange={e =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              className="w-full rounded-lg bg-[#f6e7dc] dark:bg-[#071B2B] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800 h-20"
              required
            />
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">
                Event Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEventFile}
                className="w-full text-xs text-gray-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:text-white dark:file:bg-neutral-100 dark:file:text-neutral-900 cursor-pointer"
                required
              />
            </div>
            {actionError && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-xs text-red-800 dark:bg-red-950 dark:text-red-200"
              >
                {actionError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEventModalOpen(false);
                  setActionError('');
                  setNewEvent({
                    title: '',
                    category: 'Events',
                    time: '',
                    description: '',
                    price: '',
                    image: '',
                  });
                  setEventDate(today(getLocalTimeZone()).toString());
                }}
                disabled={savingEvent}
                className="px-4 py-2 rounded-lg border text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEvent}
                className="px-4 py-2 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingEvent ? 'Saving…' : 'Save Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD MENU ITEM */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateMenu}
            className="max-h-[90dvh] w-full max-w-md space-y-4 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-[#071B2B]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Add Menu Items
              </h2>
              <button
                type="button"
                aria-label="Add another menu item"
                onClick={() =>
                  setMenuItems(items => [
                    ...items,
                    { name: '', price: '', description: '' },
                  ])
                }
                className="inline-flex size-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </button>
            </div>
            <select
              value={menuCategory}
              onChange={e => setMenuCategory(e.target.value)}
              className="w-full rounded-lg bg-[#f6e7dc] dark:bg-[#071B2B] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800"
            >
              <option value="Cocktails">Cocktails</option>
              <option value="Main Course">Main Course</option>
              <option value="Appetizers">Appetizers</option>
              <option value="Beverages">Beverages & Desserts</option>
            </select>
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <fieldset
                  key={index}
                  className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                >
                  <div className="flex items-center justify-between">
                    <legend className="text-sm font-medium">
                      Menu item {index + 1}
                    </legend>
                    {menuItems.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Remove menu item ${index + 1}`}
                        onClick={() =>
                          setMenuItems(items =>
                            items.filter((_, itemIndex) => itemIndex !== index),
                          )
                        }
                        className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Item Name (e.g. Signature Mojito)"
                    aria-label={`Menu item ${index + 1} name`}
                    value={item.name}
                    onChange={e =>
                      setMenuItems(items =>
                        items.map((currentItem, itemIndex) =>
                          itemIndex === index
                            ? { ...currentItem, name: e.target.value }
                            : currentItem,
                        ),
                      )
                    }
                    className="w-full rounded-lg bg-[#f6e7dc] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:bg-[#071B2B] dark:ring-neutral-800"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price ($)"
                    aria-label={`Menu item ${index + 1} price`}
                    value={item.price}
                    onChange={e =>
                      setMenuItems(items =>
                        items.map((currentItem, itemIndex) =>
                          itemIndex === index
                            ? { ...currentItem, price: e.target.value }
                            : currentItem,
                        ),
                      )
                    }
                    className="w-full rounded-lg bg-[#f6e7dc] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:bg-[#071B2B] dark:ring-neutral-800"
                    required
                  />
                  <textarea
                    placeholder="Ingredients / Description..."
                    aria-label={`Menu item ${index + 1} description`}
                    value={item.description}
                    onChange={e =>
                      setMenuItems(items =>
                        items.map((currentItem, itemIndex) =>
                          itemIndex === index
                            ? { ...currentItem, description: e.target.value }
                            : currentItem,
                        ),
                      )
                    }
                    className="h-20 w-full rounded-lg bg-[#f6e7dc] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:bg-[#071B2B] dark:ring-neutral-800"
                    required
                  />
                </fieldset>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Menu Card Image (shared by these items)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMenuFile}
                className="w-full text-xs text-gray-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:text-white dark:file:bg-neutral-100 dark:file:text-neutral-900 cursor-pointer"
                required
              />
            </div>
            {actionError && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-xs text-red-800 dark:bg-red-950 dark:text-red-200"
              >
                {actionError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMenuModalOpen(false);
                  setActionError('');
                  setMenuItems([{ name: '', price: '', description: '' }]);
                  setMenuImage('');
                  setMenuCategory('Cocktails');
                }}
                className="px-4 py-2 rounded-lg border text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingMenu}
                className="px-4 py-2 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingMenu
                  ? 'Saving…'
                  : `Save ${menuItems.length} Item${menuItems.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white dark:bg-[#071B2B] rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Edit Manager Profile
            </h2>
            <input
              type="text"
              value={tempProfile.name}
              onChange={e =>
                setTempProfile({ ...tempProfile, name: e.target.value })
              }
              className="w-full rounded-lg bg-[#f6e7dc] dark:bg-[#071B2B] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800"
              required
            />
            <input
              type="email"
              value={tempProfile.email}
              onChange={e =>
                setTempProfile({ ...tempProfile, email: e.target.value })
              }
              className="w-full rounded-lg bg-[#f6e7dc] dark:bg-[#071B2B] px-3 py-2 text-xs ring-1 ring-neutral-300 dark:ring-neutral-800"
              required
            />
            <div className="flex items-center gap-4">
              <img
                src={getAvatarSrc(tempProfile.avatar)}
                alt="Avatar"
                className="size-12 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleAvatarUpload}
                className="w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-neutral-900 file:text-white dark:file:bg-neutral-100 dark:file:text-neutral-900 cursor-pointer"
              />
            </div>
            {profileError && (
              <p role="alert" className="text-xs text-red-600">
                {profileError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setProfileError('');
                  setIsProfileOpen(false);
                }}
                className="px-4 py-2 rounded-lg border text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-4 py-2 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {savingProfile ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}