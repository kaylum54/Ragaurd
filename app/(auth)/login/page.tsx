'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Force a hard navigation to ensure cookies are read
      window.location.href = data.redirectTo;
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-sm px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="text-base font-semibold text-white">Ragaurd</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white mb-2">Sign in</h1>
          <p className="text-sm text-slate-400 mb-8">
            Enter your credentials to access your account
          </p>

          {/* Demo Credentials */}
          <div className="mb-8 p-4 border border-slate-700/50 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Demo credentials</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Admin:</span>
                <span className="text-white font-mono text-xs">admin@ragaurd.com / Ragaurd2024!</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">User:</span>
                <span className="text-white font-mono text-xs">demo@ragaurd.com / demo123</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-slate-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-md text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-slate-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-md text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-sm text-slate-500 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
