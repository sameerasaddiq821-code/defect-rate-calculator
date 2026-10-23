import React from 'react';
import { DefectCategory } from '../types/qc';
import { Plus, Minus, Layers } from 'lucide-react';

interface DefectCategoryTrackerProps {
  categories: DefectCategory[];
  onChange: (categories: DefectCategory[]) => void;
  syncWithTotal: boolean;
  onToggleSync: (sync: boolean) => void;
  totalDefective: number;
}

export const DefectCategoryTracker: React.FC<DefectCategoryTrackerProps> = ({
  categories,
  onChange,
  syncWithTotal,
  onToggleSync,
  totalDefective
}) => {
  const handleCountChange = (id: string, delta: number) => {
    const updated = categories.map((cat) => {
      if (cat.id === id) {
        return { ...cat, count: Math.max(0, cat.count + delta) };
      }
      return cat;
    });
    onChange(updated);
  };

  const handleManualInput = (id: string, val: string) => {
    const num = parseInt(val, 10);
    const updated = categories.map((cat) => {
      if (cat.id === id) {
        return { ...cat, count: isNaN(num) ? 0 : Math.max(0, num) };
      }
      return cat;
    });
    onChange(updated);
  };

  const totalCategorized = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-800">
            Defect Classification Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-normal">
            (Identifies top defect for hourly audits)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={syncWithTotal}
              onChange={(e) => onToggleSync(e.target.checked)}
              className="rounded text-slate-900 focus:ring-slate-500 w-3.5 h-3.5 cursor-pointer"
            />
            Auto-sum into Total Defective
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`p-3 rounded-lg border transition-all ${
              cat.count > 0 ? 'bg-slate-50/80 border-slate-300' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="truncate pr-2">{cat.name}</span>
              {totalCategorized > 0 && cat.count > 0 && (
                <span className="text-[11px] font-mono-numbers text-slate-500">
                  {((cat.count / totalCategorized) * 100).toFixed(0)}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCountChange(cat.id, -1)}
                disabled={cat.count <= 0}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-700"
                aria-label={`Decrease ${cat.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="number"
                min="0"
                value={cat.count}
                onChange={(e) => handleManualInput(cat.id, e.target.value)}
                className="w-full text-center font-mono-numbers text-sm font-semibold py-1 px-2 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-500"
              />

              <button
                type="button"
                onClick={() => handleCountChange(cat.id, 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer text-slate-700"
                aria-label={`Increase ${cat.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalCategorized !== totalDefective && !syncWithTotal && totalCategorized > 0 && (
        <div className="mt-3 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center justify-between">
          <span>
            Notice: Categorized sum ({totalCategorized}) differs from entered Defective count ({totalDefective}).
          </span>
          <button
            type="button"
            onClick={() => onToggleSync(true)}
            className="font-semibold underline ml-2 cursor-pointer"
          >
            Sync Now
          </button>
        </div>
      )}
    </div>
  );
};
