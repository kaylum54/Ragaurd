'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#threats', label: 'Threats' },
  { href: '#solution', label: 'Solution' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'navbar-blur' : 'bg-transparent'
      )}
    >
      <nav className="container flex h-16 md:h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-void" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Ragaurd
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium px-4 py-2 text-white-60 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 text-white-60 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-sm"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div className={cn(
        'md:hidden overflow-hidden transition-all duration-300',
        mobileMenuOpen ? 'max-h-[400px]' : 'max-h-0'
      )}>
        <div className="bg-void-200 border-t border-white/5">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white-60 hover:text-white hover:bg-white/5 py-3 px-4 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-white/5">
              <Link
                href="/login"
                className="text-sm font-medium text-white-60 py-3 px-4 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-sm text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
