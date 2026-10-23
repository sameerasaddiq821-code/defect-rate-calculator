import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface QuickTestBarProps {
  onSelectTest: (checked: number, defective: number, label: string) => void;
  onReset: () => void;
}

export const QuickTestBar: React.FC<QuickTestBarProps> = ({ onSelectTest, onReset }) => {
  const testCases = [
    {
      label: 'Test Green',
      expected: 'Excellent (≤ 2%)',
      checked: 100,
      defective: 2,
      rate: '2.0%',
      colorClass: 'border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100',
      dotColor: '#1B7A3A'
    },
    {
      label: 'Test Amber',
      expected: 'Acceptable (> 2% & ≤ 5%)',
      checked: 100,
      defective: 5,
      rate: '5.0%',
      colorClass: 'border-amber-500 text-amber-900 bg-amber-50 hover:bg-amber-100',
      dotColor: '#E0A100'
    },
    {
      label: 'Test Red',
      expected: 'Action Required (> 5%)',
      checked: 100,
      defective: 6,
      rate: '6.0%',
      colorClass: 'border-red-600 text-red-900 bg-red-50 hover:bg-red-100',
      dotColor: '#B42318'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            One-Click Benchmark & Verification Tests
          </span>
        </div>
        <span className="text-xs text-slate-500">
          Validates mandatory 2% and 5% threshold logic
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {testCases.map((tc) => (
          <button
            key={tc.label}
            onClick={() => onSelectTest(tc.checked, tc.defective, tc.label)}
            type="button"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-left transition-all hover:shadow-xs cursor-pointer ${tc.colorClass}`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0 border"
                style={{ backgroundColor: tc.dotColor, borderColor: tc.dotColor }}
              />
              <div>
                <div className="text-xs font-bold leading-tight">{tc.label}</div>
                <div className="text-[11px] opacity-80">
                  {tc.checked} checked · {tc.defective} defective
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono-numbers text-xs font-bold">
              <span>{tc.rate}</span>
              <Play className="w-3 h-3 opacity-60" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
