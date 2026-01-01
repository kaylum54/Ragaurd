import Link from 'next/link';
import { Shield } from 'lucide-react';

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

export function Footer() {
  return (
    <footer className="py-12 bg-navy-950 border-t border-navy-800">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-navy-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">Ragaurd</span>
            </Link>
            <p className="mt-3 text-xs text-navy-400 max-w-xs">
              Voice AI Security Infrastructure
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-medium text-navy-300 uppercase tracking-wide mb-3">Product</h4>
            <ul className="space-y-2">
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
            <h4 className="text-xs font-medium text-navy-300 uppercase tracking-wide mb-3">Resources</h4>
            <ul className="space-y-2">
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
            <h4 className="text-xs font-medium text-navy-300 uppercase tracking-wide mb-3">Legal</h4>
            <ul className="space-y-2">
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
        <div className="mt-10 pt-6 border-t border-navy-800 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-navy-500">
            &copy; {new Date().getFullYear()} Ragaurd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://twitter.com" className="text-xs text-navy-500 hover:text-navy-300 transition-colors">
              Twitter/X
            </Link>
            <Link href="https://linkedin.com" className="text-xs text-navy-500 hover:text-navy-300 transition-colors">
              LinkedIn
            </Link>
            <Link href="https://github.com" className="text-xs text-navy-500 hover:text-navy-300 transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
