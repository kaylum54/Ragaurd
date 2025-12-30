import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';

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
    <footer className="py-16 bg-sidebar border-t border-[rgba(59,130,246,0.1)]">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo variant="light" size="sm" />
            <p className="mt-4 text-sm text-steel-500 max-w-xs">
              Enterprise-grade security for voice AI systems.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="section-header mb-4">Product</div>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-steel-400 hover:text-steel-100 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="section-header mb-4">Company</div>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-steel-400 hover:text-steel-100 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="section-header mb-4">Legal</div>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-steel-400 hover:text-steel-100 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[rgba(59,130,246,0.1)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-steel-500">
            © {new Date().getFullYear()} RAGuard. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-steel-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
