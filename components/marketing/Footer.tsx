'use client';

import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

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
    <footer className="bg-void-100 border-t border-white/5">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-void" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Ragaurd</span>
            </Link>
            <p className="mt-5 text-sm text-white-40 max-w-xs leading-relaxed">
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
            <h4 className="text-[10px] font-bold text-white-40 uppercase tracking-[0.2em] mb-5">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white-40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white-40 uppercase tracking-[0.2em] mb-5">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white-40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white-40 uppercase tracking-[0.2em] mb-5">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white-40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white-20">
            &copy; {new Date().getFullYear()} Ragaurd. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white-40 hover:text-white transition-colors"
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
