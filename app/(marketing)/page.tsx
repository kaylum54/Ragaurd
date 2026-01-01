import { Hero } from '@/components/marketing/Hero';
import { Problem } from '@/components/marketing/Problem';
import { WhyNow } from '@/components/marketing/WhyNow';
import { Solution } from '@/components/marketing/Solution';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { RedTeam } from '@/components/marketing/RedTeam';
import { Pricing } from '@/components/marketing/Pricing';
import { FAQ } from '@/components/marketing/FAQ';
import { FinalCTA } from '@/components/marketing/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <WhyNow />
      <Solution />
      <HowItWorks />
      <RedTeam />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}
