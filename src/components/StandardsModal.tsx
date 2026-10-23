import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { STATUS_CONFIGS } from '../utils/qcCalculator';

interface StandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandardsModal: React.FC<StandardsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-slate-800" />
            <h3 className="text-base font-bold text-slate-900">
              QC Defect Rate Standard Operating Procedure (SOP)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Whole Number Comparison Rule:</p>
              <p className="mt-0.5">
                Calculations are computed using integer arithmetic to prevent decimal rounding discrepancies:
                <code className="mx-1 px-1 py-0.5 bg-white border rounded font-mono text-[11px]">defective × 100 ≤ threshold × checked</code>.
                Exactly 2% maps to Green (Excellent), and exactly 5% maps to Amber (Acceptable).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Green */}
            <div
              className="p-4 rounded-xl border-4"
              style={{
                backgroundColor: STATUS_CONFIGS['Excellent'].bgColor,
                borderColor: STATUS_CONFIGS['Excellent'].borderColor,
                color: STATUS_CONFIGS['Excellent'].textColor
              }}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  Status: Excellent (≤ 2.0%)
                </span>
                <span className="font-mono text-xs">Bg: #DFF3E5 | Border: #1B7A3A</span>
              </div>
              <div className="mt-2 text-sm font-extrabold">
                Instruction: "{STATUS_CONFIGS['Excellent'].instruction}"
              </div>
              <p className="text-xs mt-1 opacity-90">
                Process is stable. No remedial adjustment needed. Continue standard sampling schedule.
              </p>
            </div>

            {/* Amber */}
            <div
              className="p-4 rounded-xl border-4"
              style={{
                backgroundColor: STATUS_CONFIGS['Acceptable'].bgColor,
                borderColor: STATUS_CONFIGS['Acceptable'].borderColor,
                color: STATUS_CONFIGS['Acceptable'].textColor
              }}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2 text-base">
                  <AlertTriangle className="w-5 h-5" />
                  Status: Acceptable (&gt; 2.0% & ≤ 5.0%)
                </span>
                <span className="font-mono text-xs">Bg: #FFE9A8 | Border: #E0A100</span>
              </div>
              <div className="mt-2 text-sm font-extrabold">
                Instruction: "{STATUS_CONFIGS['Acceptable'].instruction}"
              </div>
              <p className="text-xs mt-1 opacity-90">
                Within operational tolerances but approaching warning limits. Pinpoint the top defect category and conduct intensified spot checks at the next hourly checkpoint.
              </p>
            </div>

            {/* Red */}
            <div
              className="p-4 rounded-xl border-4"
              style={{
                backgroundColor: STATUS_CONFIGS['Action required'].bgColor,
                borderColor: STATUS_CONFIGS['Action required'].borderColor,
                color: STATUS_CONFIGS['Action required'].textColor
              }}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2 text-base">
                  <AlertOctagon className="w-5 h-5" />
                  Status: Action required (&gt; 5.0%)
                </span>
                <span className="font-mono text-xs">Bg: #FBD9D5 | Border: #B42318</span>
              </div>
              <div className="mt-2 text-sm font-extrabold">
                Instruction: "{STATUS_CONFIGS['Action required'].instruction}"
              </div>
              <p className="text-xs mt-1 opacity-90">
                Critical process failure. Immediately halt active manufacturing line, isolate the produced batch, and notify the Quality Control Manager for root cause investigation.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
