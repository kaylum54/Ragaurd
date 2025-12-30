'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

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
    <div className="min-h-screen flex flex-col bg-base">
      {/* Header */}
      <header className="border-b border-[rgba(59,130,246,0.1)]">
        <div className="container h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-steel-500 hover:text-steel-100 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-sm px-6 animate-fade-in">
          {/* Logo */}
          <div className="mb-12">
            <Logo variant="light" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-steel-100 mb-2">Sign in</h1>
          <p className="text-sm text-steel-500 mb-8">
            Enter your credentials to access your account
          </p>

          {/* Demo Credentials */}
          <div className="mb-8 p-4 border border-[rgba(59,130,246,0.1)] bg-card rounded-lg">
            <div className="section-header mb-3">Demo credentials</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-steel-500">Admin:</span>
                <span className="text-steel-100 font-mono text-xs">admin@ragaurd.com / Ragaurd2024!</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel-500">User:</span>
                <span className="text-steel-100 font-mono text-xs">demo@ragaurd.com / demo123</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] rounded-lg flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-danger" />
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-steel-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field w-full"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-steel-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-sm text-steel-500 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-electric-500 hover:text-electric-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
