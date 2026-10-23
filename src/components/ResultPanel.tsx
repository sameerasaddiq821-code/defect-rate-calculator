import React from 'react';
import { CalculationResult } from '../types/qc';
import { CheckCircle2, AlertTriangle, AlertOctagon, ClipboardCheck, ArrowRight, ShieldCheck, Factory, User, Hash } from 'lucide-react';

interface ResultPanelProps {
  result: CalculationResult;
  onLogAudit?: (result: CalculationResult) => void;
  isLogged?: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  result,
  onLogAudit,
  isLogged = false
}) => {
  const { statusConfig, checked, defective, passed, defectPercentage, topDefectType } = result;

  const StatusIcon = () => {
    switch (statusConfig.status) {
      case 'Excellent':
        return <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 shrink-0 stroke-[2.5]" style={{ color: statusConfig.textColor }} />;
      case 'Acceptable':
        return <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 shrink-0 stroke-[2.5]" style={{ color: statusConfig.textColor }} />;
      case 'Action required':
        return <AlertOctagon className="w-10 h-10 md:w-12 md:h-12 shrink-0 stroke-[2.5]" style={{ color: statusConfig.textColor }} />;
    }
  };

  // Format percentage: integer if whole number, otherwise up to 2 decimal places
  const formattedPercentage = Number.isInteger(defectPercentage)
    ? defectPercentage.toFixed(0)
    : defectPercentage.toFixed(2);

  // Exact whole number math description for transparency
  const wholeNumberExpression = `${defective} × 100 = ${defective * 100}`;
  const thresholdExpression = statusConfig.status === 'Excellent'
    ? `${wholeNumberExpression} ≤ 2 × ${checked} (${2 * checked})`
    : statusConfig.status === 'Acceptable'
      ? `${wholeNumberExpression} ≤ 5 × ${checked} (${5 * checked})`
      : `${wholeNumberExpression} > 5 × ${checked} (${5 * checked})`;

  return (
    <div
      id="qc-result-panel"
      className="w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative"
      style={{
        backgroundColor: statusConfig.bgColor,
        borderColor: statusConfig.borderColor,
        borderWidth: '4px',
        borderStyle: 'solid',
        color: statusConfig.textColor
      }}
    >
      {/* 1. Large solid coloured bar at the top (mandatory: at least 16px tall) */}
      <div
        className="w-full h-6 shrink-0"
        style={{
          backgroundColor: statusConfig.barColor,
          minHeight: '20px'
        }}
        aria-hidden="true"
      />

      {/* Main Content Area filled with the status colour */}
      <div className="p-6 md:p-8">
        {/* Header: Status word and Large Visual Icon */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b"
          style={{ borderColor: `${statusConfig.borderColor}40` }}
        >
          <div className="flex items-center gap-4">
            <StatusIcon />
            <div>
              <div className="text-xs uppercase tracking-widest font-bold opacity-80">
                Quality Audit Status
              </div>
              {/* Mandatory Status Word in large bold font for colour-blind users */}
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase"
                style={{ color: statusConfig.textColor }}
              >
                {statusConfig.status}
              </h2>
            </div>
          </div>

          {/* Large Defect Percentage Display */}
          <div className="flex items-baseline gap-2 bg-white/60 backdrop-blur-xs px-5 py-3 rounded-xl border"
            style={{ borderColor: `${statusConfig.borderColor}50` }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
              Defect Rate:
            </span>
            <span
              className="font-mono-numbers text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: statusConfig.textColor }}
            >
              {formattedPercentage}%
            </span>
          </div>
        </div>

        {/* 2. Mandatory Directive Instruction in large text */}
        <div className="my-6 p-5 rounded-xl bg-white/75 backdrop-blur-xs border"
          style={{ borderColor: `${statusConfig.borderColor}60` }}
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
            Mandatory Action Instruction
          </div>
          <div
            className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-snug tracking-tight"
            style={{ color: statusConfig.textColor }}
          >
            "{statusConfig.instruction}"
          </div>
          <p className="text-sm mt-1.5 opacity-90 font-medium">
            {statusConfig.description}
          </p>
        </div>

        {/* 3. Core Inspection Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
          <div className="bg-white/60 p-4 rounded-xl border" style={{ borderColor: `${statusConfig.borderColor}40` }}>
            <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">Checked Units</div>
            <div className="font-mono-numbers text-2xl md:text-3xl font-bold mt-1" style={{ color: statusConfig.textColor }}>
              {checked.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/60 p-4 rounded-xl border" style={{ borderColor: `${statusConfig.borderColor}40` }}>
            <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">Defective Units</div>
            <div className="font-mono-numbers text-2xl md:text-3xl font-bold mt-1" style={{ color: statusConfig.textColor }}>
              {defective.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/60 p-4 rounded-xl border" style={{ borderColor: `${statusConfig.borderColor}40` }}>
            <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">Passed Units</div>
            <div className="font-mono-numbers text-2xl md:text-3xl font-bold mt-1" style={{ color: statusConfig.textColor }}>
              {passed.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/60 p-4 rounded-xl border" style={{ borderColor: `${statusConfig.borderColor}40` }}>
            <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">Yield Rate</div>
            <div className="font-mono-numbers text-2xl md:text-3xl font-bold mt-1" style={{ color: statusConfig.textColor }}>
              {checked > 0 ? ((passed / checked) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>

        {/* 4. Top Defect Type Focus (Crucial for Amber status instruction) */}
        {topDefectType && (
          <div
            className="mb-6 p-4 rounded-xl bg-white/70 border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{ borderColor: `${statusConfig.borderColor}50` }}
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-white/80 shadow-xs">
                <AlertTriangle className="w-5 h-5" style={{ color: statusConfig.textColor }} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Primary Defect Category Identified:
                </div>
                <div className="text-base sm:text-lg font-bold" style={{ color: statusConfig.textColor }}>
                  {topDefectType.name}
                </div>
              </div>
            </div>
            <div className="font-mono-numbers text-sm font-semibold px-3 py-1.5 rounded-lg bg-white/90 shadow-xs self-start sm:self-auto">
              {topDefectType.count} defects ({topDefectType.percentage}% of rejects)
            </div>
          </div>
        )}

        {/* 5. Formula & Audit Context Footer */}
        <div className="pt-4 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-medium opacity-90"
          style={{ borderColor: `${statusConfig.borderColor}40` }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5" /> {result.lineId}
            </span>
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> {result.batchId}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {result.inspectorName}
            </span>
            <span className="font-mono-numbers">
              {result.timestamp}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono-numbers bg-white/60 px-2 py-1 rounded border text-[11px]"
              style={{ borderColor: `${statusConfig.borderColor}40` }}
            >
              Exact Rule: {thresholdExpression}
            </span>

            {onLogAudit && (
              <button
                onClick={() => onLogAudit(result)}
                disabled={isLogged}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                style={{
                  backgroundColor: isLogged ? `${statusConfig.borderColor}30` : statusConfig.borderColor,
                  color: isLogged ? statusConfig.textColor : '#FFFFFF'
                }}
              >
                {isLogged ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Logged to Shift
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Log Audit Entry
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
