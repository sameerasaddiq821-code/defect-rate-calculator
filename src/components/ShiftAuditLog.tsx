import React, { useState } from 'react';
import { AuditRecord, QCStatus } from '../types/qc';
import { Download, Copy, Trash2, Check, Filter } from 'lucide-react';

interface ShiftAuditLogProps {
  records: AuditRecord[];
  onClear: () => void;
  onDeleteRecord: (id: string) => void;
}

export const ShiftAuditLog: React.FC<ShiftAuditLogProps> = ({
  records,
  onClear,
  onDeleteRecord
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const filteredRecords = records.filter((r) => {
    if (filter === 'all') return true;
    return r.status.toLowerCase() === filter.toLowerCase();
  });

  // Calculate shift metrics
  const totalChecked = records.reduce((s, r) => s + r.checked, 0);
  const totalDefects = records.reduce((s, r) => s + r.defective, 0);
  const avgDefectRate = totalChecked > 0 ? (totalDefects / totalChecked) * 100 : 0;
  const compliantAudits = records.filter((r) => r.status !== 'Action required').length;
  const complianceRate = records.length > 0 ? (compliantAudits / records.length) * 100 : 100;

  const exportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Time', 'Line ID', 'Batch ID', 'Inspector', 'Checked', 'Defective', 'Defect %', 'Status', 'Instruction', 'Notes'];
    const rows = records.map((r) => [
      `"${r.timestamp}"`,
      `"${r.lineId}"`,
      `"${r.batchId}"`,
      `"${r.inspectorName}"`,
      r.checked,
      r.defective,
      r.defectPercentage.toFixed(2),
      `"${r.status}"`,
      `"${r.instruction}"`,
      `"${r.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qc_audit_shift_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySummary = () => {
    if (records.length === 0) return;
    const summary = `QUALITY CONTROL SHIFT SUMMARY REPORT
Date: ${new Date().toLocaleDateString()}
Total Audits: ${records.length}
Total Inspected: ${totalChecked.toLocaleString()}
Total Defective: ${totalDefects.toLocaleString()}
Shift Defect Rate: ${avgDefectRate.toFixed(2)}%
Process Compliance Rate: ${complianceRate.toFixed(1)}%
Excellent: ${records.filter((r) => r.status === 'Excellent').length}
Acceptable: ${records.filter((r) => r.status === 'Acceptable').length}
Action Required: ${records.filter((r) => r.status === 'Action required').length}
---------------------------------
Latest Audit: ${records[0]?.timestamp || 'N/A'} - ${records[0]?.status || 'N/A'} (${records[0]?.defectPercentage.toFixed(2)}%)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header & KPI Summary */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Shift Quality Audit Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical record of line inspections and compliance actions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copySummary}
              disabled={records.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Summary'}
            </button>

            <button
              onClick={exportCSV}
              disabled={records.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            {records.length > 0 && (
              <button
                onClick={onClear}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Clear all shift records"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Shift KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Audits
            </span>
            <div className="font-mono-numbers text-xl font-bold text-slate-900 mt-0.5">
              {records.length}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Shift Defect Rate
            </span>
            <div className="font-mono-numbers text-xl font-bold text-slate-900 mt-0.5">
              {avgDefectRate.toFixed(2)}%
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Inspected / Rejects
            </span>
            <div className="font-mono-numbers text-xl font-bold text-slate-900 mt-0.5">
              {totalChecked} / {totalDefects}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pass Rate (≤5%)
            </span>
            <div className="font-mono-numbers text-xl font-bold text-slate-900 mt-0.5">
              {complianceRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Filter:</span>
          {['all', 'Excellent', 'Acceptable', 'Action required'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                filter === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono-numbers text-slate-500">
          {filteredRecords.length} entries
        </span>
      </div>

      {/* Table / List */}
      {filteredRecords.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-sm">
          No audit records logged for this filter. Press "Log Audit Entry" after calculating.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Line & Batch</th>
                <th className="py-3 px-4 text-right">Checked</th>
                <th className="py-3 px-4 text-right">Defective</th>
                <th className="py-3 px-4 text-right">Defect %</th>
                <th className="py-3 px-4">Status & Instruction</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono-numbers text-slate-500 whitespace-nowrap">
                    {r.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{r.lineId}</div>
                    <div className="text-[11px] text-slate-500 font-mono-numbers">{r.batchId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers">
                    {r.checked.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers font-semibold text-slate-900">
                    {r.defective.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers font-bold">
                    {r.defectPercentage.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded font-bold text-[11px] uppercase tracking-wide border whitespace-nowrap"
                        style={{
                          backgroundColor: r.statusBgColor,
                          borderColor: r.statusBorderColor,
                          color: r.statusTextColor
                        }}
                      >
                        {r.status}
                      </span>
                      <span className="text-slate-600 truncate max-w-xs text-[11px]">
                        {r.instruction}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onDeleteRecord(r.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
