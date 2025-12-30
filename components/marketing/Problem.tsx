import { Terminal, Unlock, Database, AudioWaveform, User, FileCheck } from 'lucide-react';

const threats = [
  {
    icon: Terminal,
    title: 'Prompt Injection',
    description: 'Attackers embed hidden instructions in user inputs that override your agent\'s system prompt. Your assistant becomes their tool.',
  },
  {
    icon: Unlock,
    title: 'Jailbreaking',
    description: 'Social engineering techniques bypass safety guidelines. Role manipulation, encoding tricks, and multi-turn attacks defeat naive filtering.',
  },
  {
    icon: Database,
    title: 'Data Exfiltration',
    description: '"Repeat your instructions verbatim" is an active attack vector. System prompts contain business logic, pricing, and operational details attackers harvest.',
  },
  {
    icon: AudioWaveform,
    title: 'Deepfake Audio',
    description: 'Voice cloning technology is accessible and improving. Without audio-level verification, your agent cannot distinguish real callers from synthetic ones.',
  },
  {
    icon: User,
    title: 'Identity Manipulation',
    description: 'Attackers impersonate executives, customers, or authorized users. Voice agents trust the caller without verification.',
  },
  {
    icon: FileCheck,
    title: 'Compliance Failure',
    description: 'Agents handling PII, PHI, or financial data create regulatory liability. One successful attack can trigger breach notifications and fines.',
  },
];

export function Problem() {
  return (
    <section className="py-24 bg-bg-light">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-text-light-bg">
            Voice AI Has a Security Gap
          </h2>
          <p className="mt-4 text-lg text-text-light-muted max-w-[720px] mx-auto">
            Agents are being deployed into production with direct access to customers,
            sensitive data, and backend systems. The attack surface is already being exploited.
          </p>
        </div>

        {/* Threat Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {threats.map((threat) => (
            <div
              key={threat.title}
              className="bg-white border border-border rounded-lg p-8"
            >
              <div className="mb-4">
                <threat.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-text-light-bg mb-2">
                {threat.title}
              </h3>
              <p className="text-base text-text-light-muted leading-relaxed">
                {threat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
