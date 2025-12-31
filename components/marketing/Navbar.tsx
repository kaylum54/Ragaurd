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
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-void/90 backdrop-blur-xl border-b border-void-300 shadow-lg shadow-void/20'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      {/* Scroll progress */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
            scrolled ? 'bg-cyan-500' : 'bg-white/10 backdrop-blur-sm border border-white/20'
          )}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">Ragaurd</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium px-4 py-2 rounded-lg transition-all',
                scrolled
                  ? 'text-void-700 hover:text-white hover:bg-void-200'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={cn(
              'text-sm font-medium px-4 py-2 rounded-lg transition-all',
              scrolled ? 'text-void-700 hover:text-white' : 'text-white/80 hover:text-white'
            )}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(
              'text-sm font-semibold px-5 py-2.5 rounded-lg transition-all',
              scrolled
                ? 'bg-cyan-500 hover:bg-cyan-400 text-void'
                : 'bg-white hover:bg-white/90 text-void'
            )}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            'md:hidden p-2 rounded-lg transition-colors',
            scrolled ? 'text-white hover:bg-void-200' : 'text-white hover:bg-white/10'
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
        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="bg-void/95 backdrop-blur-xl border-t border-void-300">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-void-700 hover:text-white hover:bg-void-200 py-3 px-4 rounded-lg transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-void-300">
              <Link
                href="/login"
                className="text-sm font-medium text-void-700 hover:text-white py-3 px-4 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-cyan-500 hover:bg-cyan-400 text-void text-sm font-semibold py-3 px-4 rounded-lg text-center transition-colors"
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
