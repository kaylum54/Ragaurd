'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="container h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-sm px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-6 h-6 bg-white" />
            <span className="text-sm font-semibold text-white">RAGAURD</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-medium text-white mb-2">Sign in</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Enter your credentials to access your account
          </p>

          {/* Demo Credentials */}
          <div className="mb-8 p-4 border border-neutral-800 bg-neutral-900/50">
            <div className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Demo credentials</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Admin:</span>
                <span className="text-white font-mono text-xs">admin@ragaurd.com / Ragaurd2024!</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">User:</span>
                <span className="text-white font-mono text-xs">demo@ragaurd.com / demo123</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-transparent border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-transparent border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-sm text-neutral-600 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-white hover:text-neutral-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
