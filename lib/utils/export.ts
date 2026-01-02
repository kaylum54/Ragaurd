// Export utilities for generating CSV and PDF reports

export interface UsageExportData {
  period: {
    start: string;
    end: string;
  };
  summary: {
    textRequests: number;
    audioRequests: number;
    redteamAttacks: number;
    totalBlocked: number;
    totalPassed: number;
    blockRate: number;
    avgLatencyMs: number;
  };
  daily: {
    date: string;
    requests: number;
    blocked: number;
    passed: number;
  }[];
}

/**
 * Generate CSV content from usage data
 */
export function generateUsageCSV(data: UsageExportData): string {
  const lines: string[] = [];

  // Header
  lines.push('Ragaurd Usage Report');
  lines.push(`Period: ${formatDate(data.period.start)} to ${formatDate(data.period.end)}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  // Summary section
  lines.push('SUMMARY');
  lines.push('Metric,Value');
  lines.push(`Text Requests,${data.summary.textRequests}`);
  lines.push(`Audio Requests,${data.summary.audioRequests}`);
  lines.push(`Red Team Attacks,${data.summary.redteamAttacks}`);
  lines.push(`Total Blocked,${data.summary.totalBlocked}`);
  lines.push(`Total Passed,${data.summary.totalPassed}`);
  lines.push(`Block Rate,${data.summary.blockRate.toFixed(2)}%`);
  lines.push(`Avg Latency,${data.summary.avgLatencyMs}ms`);
  lines.push('');

  // Daily breakdown
  lines.push('DAILY BREAKDOWN');
  lines.push('Date,Total Requests,Blocked,Passed,Block Rate');
  for (const day of data.daily) {
    const dayBlockRate = day.requests > 0 ? ((day.blocked / day.requests) * 100).toFixed(2) : '0.00';
    lines.push(`${day.date},${day.requests},${day.blocked},${day.passed},${dayBlockRate}%`);
  }

  return lines.join('\n');
}

/**
 * Generate PDF content from usage data (returns HTML for print-to-PDF)
 */
export function generateUsagePDFContent(data: UsageExportData): string {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ragaurd Usage Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; padding: 40px; }
    .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: 800; color: #3b82f6; }
    .report-title { font-size: 18px; color: #666; margin-top: 8px; }
    .period { font-size: 14px; color: #888; margin-top: 4px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: 700; color: #1a1a2e; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
    .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
    .summary-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-value { font-size: 24px; font-weight: 700; color: #1a1a2e; margin-top: 4px; }
    .summary-value.danger { color: #ef4444; }
    .summary-value.success { color: #22c55e; }
    .summary-value.accent { color: #3b82f6; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
    td { font-size: 14px; }
    .text-right { text-align: right; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">RAGAURD</div>
    <div class="report-title">Usage & Security Report</div>
    <div class="period">${formatDate(data.period.start)} - ${formatDate(data.period.end)}</div>
  </div>

  <div class="section">
    <div class="section-title">Summary</div>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-label">Text Requests</div>
        <div class="summary-value">${data.summary.textRequests.toLocaleString()}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Audio Requests</div>
        <div class="summary-value">${data.summary.audioRequests.toLocaleString()}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Threats Blocked</div>
        <div class="summary-value danger">${data.summary.totalBlocked.toLocaleString()}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Block Rate</div>
        <div class="summary-value accent">${data.summary.blockRate.toFixed(2)}%</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Key Metrics</div>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-label">Total Requests</div>
        <div class="summary-value">${(data.summary.totalBlocked + data.summary.totalPassed).toLocaleString()}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Passed</div>
        <div class="summary-value success">${data.summary.totalPassed.toLocaleString()}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Avg Latency</div>
        <div class="summary-value">${data.summary.avgLatencyMs}ms</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Red Team Scans</div>
        <div class="summary-value">${data.summary.redteamAttacks}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Daily Breakdown</div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th class="text-right">Total Requests</th>
          <th class="text-right">Blocked</th>
          <th class="text-right">Passed</th>
          <th class="text-right">Block Rate</th>
        </tr>
      </thead>
      <tbody>
        ${data.daily.map(day => {
          const dayBlockRate = day.requests > 0 ? ((day.blocked / day.requests) * 100).toFixed(2) : '0.00';
          return `
            <tr>
              <td>${day.date}</td>
              <td class="text-right">${day.requests.toLocaleString()}</td>
              <td class="text-right">${day.blocked.toLocaleString()}</td>
              <td class="text-right">${day.passed.toLocaleString()}</td>
              <td class="text-right">${dayBlockRate}%</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    Generated by Ragaurd on ${new Date().toLocaleString()} | https://ragaurd.com
  </div>
</body>
</html>
  `.trim();

  return html;
}

/**
 * Download a file with the given content
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export usage data as CSV
 */
export function exportUsageCSV(data: UsageExportData): void {
  const csv = generateUsageCSV(data);
  const filename = `ragaurd-usage-report-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export usage data as PDF (opens print dialog)
 */
export function exportUsagePDF(data: UsageExportData): void {
  const html = generateUsagePDFContent(data);
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      printWindow.print();
    };

    // Fallback for browsers that don't trigger onload properly
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
