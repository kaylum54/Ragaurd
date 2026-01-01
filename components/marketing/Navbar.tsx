'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#problem', label: 'Why Security' },
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
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-navy-100' : 'bg-transparent'
      )}
    >
      <nav className="container flex h-24 md:h-32 items-center justify-between py-4">
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/ragaurd-logo.png"
            alt="Ragaurd - AI Voice Defense System"
            width={450}
            height={112}
            className="h-20 md:h-24 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium px-4 py-2 text-navy-600 hover:text-navy-950 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 text-navy-600 hover:text-navy-950 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-sm px-5 py-2.5"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-navy-600 hover:text-navy-950"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div className={cn(
        'md:hidden overflow-hidden transition-all duration-300',
        mobileMenuOpen ? 'max-h-[400px]' : 'max-h-0'
      )}>
        <div className="bg-white border-t border-navy-100">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-navy-600 hover:text-navy-950 hover:bg-navy-50 py-3 px-4 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-navy-100">
              <Link
                href="/login"
                className="btn-secondary text-sm justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-sm justify-center"
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
