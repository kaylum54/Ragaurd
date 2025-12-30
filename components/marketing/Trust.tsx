const metrics = [
  { metric: 'Attack Block Rate', value: '99.53%' },
  { metric: 'False Positive Rate', value: '0.00%' },
  { metric: 'Average Latency', value: '19.2ms' },
  { metric: 'Detection Patterns', value: '183' },
  { metric: 'Attack Categories', value: '13' },
  { metric: 'Audio Deepfake EER', value: '0.83%' },
];

export function Trust() {
  return (
    <section className="py-24 bg-bg-light" id="trust">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-text-light-bg">
            Tested Against Real Attack Patterns
          </h2>
        </div>

        {/* Metrics Table */}
        <div className="max-w-[600px] mx-auto mb-8">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-light-bg">
                    Metric
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-light-bg">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {metrics.map((row) => (
                  <tr key={row.metric}>
                    <td className="px-6 py-4 text-sm text-text-light-muted">
                      {row.metric}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-text-light-bg tabular-nums">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology Note */}
        <div className="max-w-[640px] mx-auto mb-6">
          <div className="bg-slate-100 rounded-md px-6 py-4">
            <p className="text-sm text-text-light-muted">
              Testing conducted against our combined attack suite (428+ unique patterns)
              as of December 2024. Includes cross-reference against published jailbreak
              repositories and real-world attack samples observed in production environments.
            </p>
          </div>
        </div>

        {/* Honest Disclaimer */}
        <div className="max-w-[640px] mx-auto text-center">
          <p className="text-sm text-text-light-muted italic">
            We don't claim 100% protection. No security system does. Ragaurd is a defense
            layer that significantly raises the difficulty of attacking your voice agents.
          </p>
        </div>
      </div>
    </section>
  );
}
