const layers = [
  {
    title: 'Pattern Detection',
    description: '183 attack signatures across 13 categories. Prompt injection, jailbreaks, delimiter attacks, encoding bypasses, social engineering.',
  },
  {
    title: 'ML Classification',
    description: 'DeBERTa-based classifier trained on adversarial datasets. Catches novel attacks that don\'t match known patterns.',
  },
  {
    title: 'Input Sanitization',
    description: 'SQL injection, XSS, command injection, and path traversal detection. Defense in depth for backend systems.',
  },
  {
    title: 'PII Detection',
    description: 'Identifies personally identifiable information before it enters your pipeline. Supports GDPR, HIPAA, SOC2 compliance.',
  },
  {
    title: 'Semantic Analysis',
    description: 'Context-aware detection of manipulation attempts using synonyms, paraphrasing, or multi-turn strategies.',
  },
  {
    title: 'Audio Verification',
    description: 'AASIST-L and LCNN models detect synthetic and cloned audio. 0.83% Equal Error Rate on deepfake detection.',
  },
];

export function Solution() {
  return (
    <section className="py-24 bg-bg-light" id="solution">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-text-light-bg">
            One API. Six Layers of Defense.
          </h2>
          <p className="mt-4 text-lg text-text-light-muted max-w-[640px] mx-auto">
            Ragaurd inspects every input before it reaches your agent's LLM. Attacks are
            blocked in real-time. Legitimate traffic passes through.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="max-w-[800px] mx-auto mb-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {/* User Input Box */}
            <div className="px-6 py-4 bg-white border border-border rounded-md">
              <span className="font-mono text-sm text-text-light-bg">User Input</span>
            </div>

            {/* Arrow */}
            <div className="text-border rotate-90 md:rotate-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Ragaurd API Box */}
            <div className="px-6 py-4 bg-white border border-border rounded-md">
              <span className="font-mono text-sm text-text-light-bg">Ragaurd API</span>
            </div>

            {/* Arrow */}
            <div className="text-border rotate-90 md:rotate-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Your Agent Box */}
            <div className="px-6 py-4 bg-white border border-border rounded-md">
              <span className="font-mono text-sm text-text-light-bg">Your Agent</span>
            </div>
          </div>

          {/* Blocked/Passed indicator */}
          <div className="mt-6 flex justify-center">
            <div className="px-6 py-3 bg-slate-100 border border-border rounded-md">
              <span className="font-mono text-sm text-text-light-muted">BLOCKED or PASSED</span>
            </div>
          </div>
        </div>

        {/* Defense Layers */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {layers.map((layer) => (
            <div
              key={layer.title}
              className="bg-white border border-border rounded-lg p-6"
              style={{ borderLeft: '3px solid #2563EB' }}
            >
              <h4 className="text-base font-semibold text-text-light-bg mb-2">
                {layer.title}
              </h4>
              <p className="text-[15px] text-text-light-muted leading-relaxed">
                {layer.description}
              </p>
            </div>
          ))}
        </div>

        {/* Integration Code Block */}
        <div className="max-w-[640px] mx-auto">
          <div className="bg-bg-dark rounded-lg overflow-hidden">
            <div className="p-6">
              <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-text-light-muted">{'// Add one API call to your voice pipeline'}</span>{'\n'}
                  <span className="text-secondary">const</span>{' '}
                  <span className="text-text-dark-bg">result</span>{' '}
                  <span className="text-text-dark-bg">=</span>{' '}
                  <span className="text-secondary">await</span>{' '}
                  <span className="text-text-dark-bg">ragaurd.</span>
                  <span className="text-[#34D399]">defend</span>
                  <span className="text-text-dark-bg">{'({'}</span>{'\n'}
                  <span className="text-text-dark-bg">{'  input: '}</span>
                  <span className="text-text-dark-bg">userMessage,</span>{'\n'}
                  <span className="text-text-dark-bg">{'  profile: '}</span>
                  <span className="text-[#34D399]">{`'balanced'`}</span>{'\n'}
                  <span className="text-text-dark-bg">{'});'}</span>{'\n'}
                  {'\n'}
                  <span className="text-secondary">if</span>{' '}
                  <span className="text-text-dark-bg">{'(result.status === '}</span>
                  <span className="text-[#34D399]">{`'blocked'`}</span>
                  <span className="text-text-dark-bg">{')'}</span>{' '}
                  <span className="text-text-dark-bg">{'{'}</span>{'\n'}
                  <span className="text-text-dark-bg">{'  '}</span>
                  <span className="text-secondary">return</span>{' '}
                  <span className="text-text-dark-bg">{'{ error: '}</span>
                  <span className="text-[#34D399]">{`'Input blocked for security'`}</span>
                  <span className="text-text-dark-bg">{' };'}</span>{'\n'}
                  <span className="text-text-dark-bg">{'}'}</span>{'\n'}
                  {'\n'}
                  <span className="text-text-light-muted">{'// Continue to your LLM'}</span>{'\n'}
                  <span className="text-secondary">return</span>{' '}
                  <span className="text-secondary">await</span>{' '}
                  <span className="text-[#34D399]">sendToAgent</span>
                  <span className="text-text-dark-bg">(userMessage);</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
