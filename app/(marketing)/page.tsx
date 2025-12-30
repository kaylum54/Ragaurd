import { Hero } from '@/components/marketing/Hero';
import { Features } from '@/components/marketing/Features';
import { Stats } from '@/components/marketing/Stats';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Pricing } from '@/components/marketing/Pricing';
import { CTA } from '@/components/marketing/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
    </>
  );
}
