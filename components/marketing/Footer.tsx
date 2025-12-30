import Link from 'next/link';

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
    <footer className="py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white" />
              <span className="text-sm font-semibold text-white">RAGAURD</span>
            </Link>
            <p className="mt-4 text-sm text-neutral-500 max-w-xs">
              Voice AI security platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="text-xs text-neutral-600 uppercase tracking-widest mb-4">Product</div>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="text-xs text-neutral-600 uppercase tracking-widest mb-4">Company</div>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="text-xs text-neutral-600 uppercase tracking-widest mb-4">Legal</div>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Ragaurd. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500" />
            <span className="text-xs text-neutral-600">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
