import Link from 'next/link';
import { Shield } from 'lucide-react';

const links = {
  product: [
    { href: '/pricing', label: 'Pricing' },
    { href: '/docs', label: 'Documentation' },
    { href: '/demo', label: 'Demo' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
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
    <footer className="py-12 bg-white border-t border-midnight-200">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-midnight-800 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-midnight-950">RAGuard</span>
            </Link>
            <p className="mt-3 text-xs text-midnight-500 max-w-xs">
              Voice AI security infrastructure for enterprise.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-medium text-midnight-950 uppercase tracking-wide mb-3">Product</h4>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-midnight-500 hover:text-midnight-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium text-midnight-950 uppercase tracking-wide mb-3">Company</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-midnight-500 hover:text-midnight-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-medium text-midnight-950 uppercase tracking-wide mb-3">Legal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-midnight-500 hover:text-midnight-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-midnight-200 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-midnight-500">
            &copy; {new Date().getFullYear()} RAGuard. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-secure-500 rounded-full" />
            <span className="text-xs text-midnight-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
