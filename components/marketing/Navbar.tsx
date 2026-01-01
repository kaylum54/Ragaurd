'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#solution', label: 'Solution' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-navy-950/5 border-b border-navy-100/50'
          : 'bg-transparent'
      )}
    >
      {/* Scroll progress indicator */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-navy-400 via-navy-500 to-navy-600 transition-all duration-150 ease-out"
           style={{ width: `${scrollProgress}%` }} />

      <nav className="container flex h-16 md:h-18 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={cn(
            'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105',
            scrolled
              ? 'bg-navy-950 shadow-lg'
              : 'bg-white/10 backdrop-blur-md border border-white/20'
          )}>
            <Shield className={cn(
              'w-5 h-5 transition-colors',
              scrolled ? 'text-white' : 'text-white'
            )} />
            {/* Subtle glow effect */}
            <div className={cn(
              'absolute inset-0 rounded-xl transition-opacity duration-300',
              scrolled ? 'bg-navy-500/20 opacity-0 group-hover:opacity-100' : 'bg-white/10 opacity-0 group-hover:opacity-100'
            )} />
          </div>
          <span className={cn(
            'font-bold text-xl tracking-tight transition-colors',
            scrolled ? 'text-navy-950' : 'text-white'
          )}>
            Ragaurd
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 group',
                scrolled
                  ? 'text-navy-600 hover:text-navy-950'
                  : 'text-white/70 hover:text-white'
              )}
            >
              {link.label}
              {/* Hover indicator */}
              <span className={cn(
                'absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-4',
                scrolled ? 'bg-navy-400' : 'bg-white/50'
              )} />
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className={cn(
              'text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300',
              scrolled
                ? 'text-navy-600 hover:text-navy-950 hover:bg-navy-50'
                : 'text-white/70 hover:text-white'
            )}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(
              'relative text-sm font-semibold px-6 py-2.5 rounded-xl overflow-hidden transition-all duration-300 group',
              scrolled
                ? 'bg-navy-950 text-white hover:bg-navy-800 shadow-lg shadow-navy-950/20'
                : 'bg-white text-navy-950 hover:bg-white/90 shadow-lg'
            )}
          >
            <span className="relative z-10">Get Started</span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            'md:hidden p-2.5 rounded-xl transition-all duration-300',
            scrolled
              ? 'text-navy-950 hover:bg-navy-100'
              : 'text-white hover:bg-white/10'
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        'md:hidden overflow-hidden transition-all duration-300',
        mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-navy-100">
          <div className="container py-6 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-navy-700 hover:text-navy-950 hover:bg-navy-50 py-3 px-4 rounded-xl transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-navy-100">
              <Link
                href="/login"
                className="text-sm font-medium text-navy-600 hover:text-navy-950 py-3 px-4 rounded-xl transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-navy-950 hover:bg-navy-800 text-white text-sm font-semibold py-3.5 px-4 rounded-xl text-center transition-colors shadow-lg"
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
