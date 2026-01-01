'use client';

import Link from 'next/link';
import { Shield, ArrowUpRight } from 'lucide-react';

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
  { href: 'https://twitter.com', label: 'Twitter/X' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'https://github.com', label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="relative bg-navy-950 border-t border-white/5 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-navy-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[150px] bg-navy-400/5 rounded-full blur-[80px]" />
      
      <div className="container relative py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Ragaurd</span>
            </Link>
            <p className="mt-5 text-sm text-navy-400 max-w-xs leading-relaxed">
              Voice AI Security Infrastructure. Protecting voice agents from prompt injection, jailbreaking, and deepfake attacks.
            </p>
            
            {/* Newsletter or CTA */}
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm font-medium text-white transition-all group"
              >
                Start protecting your AI
                <ArrowUpRight className="w-4 h-4 text-navy-400 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] font-bold text-navy-400 uppercase tracking-[0.2em] mb-5">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-bold text-navy-400 uppercase tracking-[0.2em] mb-5">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-bold text-navy-400 uppercase tracking-[0.2em] mb-5">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-navy-500">
            &copy; {new Date().getFullYear()} Ragaurd. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-navy-500 hover:text-navy-300 transition-colors"
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
