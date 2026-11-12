import { useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const res = await axios.post(`${apiUrl}/api/admin/login`, {
        email,
        password,
      });

      if (res.data.success) {
        // Save token and profile details locally
        localStorage.setItem('pub_admin_token', res.data.token);
        if (res.data.admin) {
          localStorage.setItem(
            'pub_admin_profile',
            JSON.stringify(res.data.admin),
          );
        }

        // Notify parent component (App.jsx) that authentication succeeded
        if (onLoginSuccess) {
          onLoginSuccess(res.data.admin);
        }
      } else {
        throw new Error(res.data.error || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to sign in. Please check your credentials and backend server.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-100 dark:bg-neutral-950 p-4 font-sans text-neutral-900 dark:text-neutral-100">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 animate-in fade-in zoom-in duration-200">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-xl bg-zinc-950 text-xl font-bold text-white dark:bg-zinc-50 dark:text-zinc-950 mb-3 shadow-sm"
          >
            P
          </span>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Admin Portal Login
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Pub &amp; Lounge Management Portal
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@publounge.com"
              className="w-full rounded-lg bg-neutral-50 dark:bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white ring-1 ring-neutral-300 dark:ring-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-neutral-50 dark:bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white ring-1 ring-neutral-300 dark:ring-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer transition-all shadow-sm"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-t border-neutral-100 dark:border-neutral-800 pt-4 text-center">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Authorized management personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
