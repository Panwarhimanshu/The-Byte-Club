import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ByteMark } from '@/components/ui/Logo';
import { useAuthStore } from '@/store/authStore';
import { adminBtn, adminInput } from '@/components/admin/kit';
import { ApiError } from '@/lib/apiClient';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-[#0f1012] px-4 text-white">
      <Helmet>
        <title>Admin sign in · The Byte Club</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#16181d] p-8">
        <div className="flex items-center gap-2 text-indigo-400">
          <ByteMark className="h-8 w-8" />
          <span className="text-sm font-bold uppercase tracking-wide text-white">Byte Admin</span>
        </div>
        <h1 className="mt-5 text-lg font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-white/45">Manage the menu, offers, reviews and store settings.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/40">Email</label>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminInput}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/40">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={adminInput}
              required
            />
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button type="submit" disabled={busy} className={`${adminBtn} w-full`}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
