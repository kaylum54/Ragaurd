import { Hero } from '@/components/marketing/Hero';
import { Problem } from '@/components/marketing/Problem';
import { WhyNow } from '@/components/marketing/WhyNow';
import { Solution } from '@/components/marketing/Solution';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { RedTeam } from '@/components/marketing/RedTeam';
import { Trust } from '@/components/marketing/Trust';
import { Pricing } from '@/components/marketing/Pricing';
import { FAQ } from '@/components/marketing/FAQ';
import { CTA } from '@/components/marketing/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <WhyNow />
      <Solution />
      <HowItWorks />
      <RedTeam />
      <Trust />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
