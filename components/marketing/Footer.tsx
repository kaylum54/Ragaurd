'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const links = {
  product: [
    { href: '/docs', label: 'Documentation' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/demo', label: 'Demo' },
    { href: '/status', label: 'Status' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/docs/api', label: 'API Reference' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/security', label: 'Security' },
  ],
};

const socialLinks = [
  { href: 'https://twitter.com', label: 'Twitter' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'https://github.com', label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-navy-100">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center group">
              <Image
                src="/images/ragaurd-logo.png"
                alt="Ragaurd - AI Voice Defense System"
                width={180}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-5 text-sm text-navy-500 max-w-xs leading-relaxed">
              Voice AI Security Infrastructure. Protecting voice agents from prompt injection, jailbreaking, and deepfake attacks.
            </p>
            
            <div className="mt-8">
              <Link
                href="/signup"
                className="btn-primary text-sm"
              >
                Start protecting your AI
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-navy-950 uppercase tracking-wider mb-5">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-500 hover:text-navy-950 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-navy-950 uppercase tracking-wider mb-5">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-500 hover:text-navy-950 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-navy-950 uppercase tracking-wider mb-5">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-500 hover:text-navy-950 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-navy-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} Ragaurd. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-navy-500 hover:text-navy-950 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
