/**
 * Client-side export utilities for TradiePilot.
 * Generates CSV and printable report content without external dependencies.
 */

/** Convert array of objects to CSV and trigger download */
export function exportCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: string; label: string }[]
): void {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  // Determine columns from first object if not provided
  const cols = columns || Object.keys(data[0]).map((key) => ({ key, label: key }));
  const header = cols.map((c) => `"${c.label}"`).join(",");
  const rows = data.map((row) =>
    cols
      .map((c) => {
        const val = row[c.key];
        if (val === null || val === undefined) return "";
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csv = [header, ...rows].join("\n");
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

/** Trigger a file download from string content */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Generate a printable job report window */
export function printJobReport(job: {
  title?: string;
  client?: { name?: string };
  quotedTotal?: number;
  actualTotal?: number;
  margin?: number;
  marginPct?: number;
  quotedLabour?: number;
  actualLabour?: number;
  quotedMaterials?: number;
  actualMaterials?: number;
  quotedSubcontractors?: number;
  actualSubcontractors?: number;
  startDate?: string;
  dueDate?: string;
  status?: string;
}): void {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Please allow pop-ups to generate the report.");
    return;
  }

  const marginColor = (job.marginPct ?? 0) >= 0 ? "#22c55e" : "#ef4444";

  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Job Report - ${job.title || ""}</title>
      <style>
        body { font-family: 'Inter', -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
        .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
        .section { margin-bottom: 24px; }
        .section h2 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        th { font-weight: 500; color: #64748b; }
        td { font-weight: 600; }
        .green { color: #22c55e; }
        .red { color: #ef4444; }
        .total { font-size: 18px; margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f172a; }
        .footer { margin-top: 40px; color: #94a3b8; font-size: 12px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>${job.title || "Job Report"}</h1>
      <p class="subtitle">${job.client?.name || ""} &middot; ${job.status || ""}</p>

      <div class="section">
        <h2>Financial Summary</h2>
        <table>
          <tr><th>Metric</th><th style="text-align:right">Value</th></tr>
          <tr><td>Quoted Total</td><td style="text-align:right">$${(job.quotedTotal || 0).toLocaleString()}</td></tr>
          <tr><td>Actual Total</td><td style="text-align:right">$${(job.actualTotal || 0).toLocaleString()}</td></tr>
          <tr><td>Margin</td><td style="text-align:right; font-weight:700" class="${(job.margin ?? 0) >= 0 ? 'green' : 'red'}">$${(job.margin || 0).toLocaleString()} (${(job.marginPct || 0).toFixed(1)}%)</td></tr>
        </table>
      </div>

      <div class="section">
        <h2>Cost Breakdown</h2>
        <table>
          <tr><th>Category</th><th style="text-align:right">Quoted</th><th style="text-align:right">Actual</th><th style="text-align:right">Variance</th></tr>
          <tr>
            <td>Labour</td>
            <td style="text-align:right">$${(job.quotedLabour || 0).toLocaleString()}</td>
            <td style="text-align:right">$${(job.actualLabour || 0).toLocaleString()}</td>
            <td style="text-align:right" class="${((job.actualLabour || 0) - (job.quotedLabour || 0)) <= 0 ? 'green' : 'red'}">${((job.actualLabour || 0) - (job.quotedLabour || 0) <= 0 ? "" : "+")}$${((job.actualLabour || 0) - (job.quotedLabour || 0)).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Materials</td>
            <td style="text-align:right">$${(job.quotedMaterials || 0).toLocaleString()}</td>
            <td style="text-align:right">$${(job.actualMaterials || 0).toLocaleString()}</td>
            <td style="text-align:right" class="${((job.actualMaterials || 0) - (job.quotedMaterials || 0)) <= 0 ? 'green' : 'red'}">${((job.actualMaterials || 0) - (job.quotedMaterials || 0) <= 0 ? "" : "+")}$${((job.actualMaterials || 0) - (job.quotedMaterials || 0)).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Subcontractors</td>
            <td style="text-align:right">$${(job.quotedSubcontractors || 0).toLocaleString()}</td>
            <td style="text-align:right">$${(job.actualSubcontractors || 0).toLocaleString()}</td>
            <td style="text-align:right" class="${((job.actualSubcontractors || 0) - (job.quotedSubcontractors || 0)) <= 0 ? 'green' : 'red'}">${((job.actualSubcontractors || 0) - (job.quotedSubcontractors || 0) <= 0 ? "" : "+")}$${((job.actualSubcontractors || 0) - (job.quotedSubcontractors || 0)).toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <p class="total"><strong>Net Margin:</strong> <span class="${(job.margin ?? 0) >= 0 ? 'green' : 'red'}">$${(job.margin || 0).toLocaleString()} (${(job.marginPct || 0).toFixed(1)}%)</span></p>

      <p class="footer">Generated by TradiePilot &middot; ${new Date().toLocaleDateString("en-AU")}</p>
      <script>window.print();</script>
    </body>
    </html>
  `);
  w.document.close();
}