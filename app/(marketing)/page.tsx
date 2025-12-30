import { Metadata } from 'next';
import { Hero } from '@/components/marketing/Hero';
import { Problem } from '@/components/marketing/Problem';
import { WhyNow } from '@/components/marketing/WhyNow';
import { Solution } from '@/components/marketing/Solution';
import { RedTeam } from '@/components/marketing/RedTeam';
import { Trust } from '@/components/marketing/Trust';
import { Pricing } from '@/components/marketing/Pricing';
import { FAQ } from '@/components/marketing/FAQ';
import { CTA } from '@/components/marketing/CTA';

export const metadata: Metadata = {
  title: 'Ragaurd - Voice AI Security Infrastructure',
  description: 'Protect voice AI agents from prompt injection, jailbreaking, and deepfake audio. One API, real-time protection, 99.53% attack block rate.',
  keywords: 'voice AI security, prompt injection protection, LLM security, voice agent security, deepfake detection, AI security API',
  openGraph: {
    title: 'Ragaurd - Voice AI Security Infrastructure',
    description: 'Protect voice AI agents from prompt injection, jailbreaking, and deepfake audio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ragaurd - Voice AI Security Infrastructure',
    description: 'Protect voice AI agents from prompt injection, jailbreaking, and deepfake audio.',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <WhyNow />
      <Solution />
      <RedTeam />
      <Trust />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
