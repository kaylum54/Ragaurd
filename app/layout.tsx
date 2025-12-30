import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'Ragaurd - Voice AI Security Platform',
    template: '%s | Ragaurd',
  },
  description:
    'Protect your Voice AI agents from prompt injection, jailbreaking, deepfakes, and data exfiltration. 99.53% attack block rate with 0% false positives.',
  keywords: [
    'voice AI security',
    'prompt injection protection',
    'jailbreak prevention',
    'deepfake detection',
    'AI agent security',
    'LLM security',
    'voice authentication',
  ],
  authors: [{ name: 'Ragaurd' }],
  creator: 'Ragaurd',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Ragaurd',
    title: 'Ragaurd - Voice AI Security Platform',
    description:
      'Protect your Voice AI agents from prompt injection, jailbreaking, deepfakes, and data exfiltration.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ragaurd - Voice AI Security Platform',
    description:
      'Protect your Voice AI agents from prompt injection, jailbreaking, deepfakes, and data exfiltration.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased')}>
        {children}
      </body>
    </html>
  );
}
