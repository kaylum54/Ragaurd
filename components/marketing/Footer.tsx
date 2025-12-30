import Link from 'next/link';
import { Shield } from 'lucide-react';

const productLinks = [
  { href: '/docs', label: 'Documentation' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/status', label: 'Status' },
  { href: '/changelog', label: 'Changelog' },
];

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/security', label: 'Security' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  return (
    <footer className="py-12 bg-bg-footer">
      <div className="container max-w-6xl">
        {/* Footer Divider */}
        <div className="mb-12 h-px bg-border-dark" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">Ragaurd</span>
            </Link>
            <p className="mt-3 text-sm text-text-dark-muted">
              Voice AI Security Infrastructure
            </p>
          </div>

          {/* Links Column */}
          <div className="grid grid-cols-2 gap-8 col-span-2 md:col-span-2">
            {/* Product */}
            <div>
              <h4 className="text-sm font-medium text-text-dark-bg mb-4">Product</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-dark-bg hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-medium text-text-dark-bg mb-4">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-dark-bg hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-12 pt-6 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Legal Links */}
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-dark-muted hover:text-text-dark-bg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-dark-muted">
            &copy; 2025 Ragaurd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
