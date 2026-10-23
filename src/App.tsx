import React, { useState } from 'react';
import {
  Calculator,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Factory,
  ShieldCheck,
  Building2,
  Hash,
  User,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { CalculationResult, DefectCategory, AuditRecord } from './types/qc';
import { calculateQCResult } from './utils/qcCalculator';
import { ResultPanel } from './components/ResultPanel';
import { QuickTestBar } from './components/QuickTestBar';
import { DefectCategoryTracker } from './components/DefectCategoryTracker';
import { ShiftAuditLog } from './components/ShiftAuditLog';
import { StandardsModal } from './components/StandardsModal';
import { ApkModal } from './components/ApkModal';

const INITIAL_CATEGORIES: DefectCategory[] = [
  { id: 'cat-1', name: 'Surface Scratch / Cosmetic', count: 0 },
  { id: 'cat-2', name: 'Dimensional / Tolerance', count: 0 },
  { id: 'cat-3', name: 'Solder / Weld Void', count: 0 },
  { id: 'cat-4', name: 'Fastening / Missing Component', count: 0 },
  { id: 'cat-5', name: 'Packaging & Barcode Label', count: 0 },
  { id: 'cat-6', name: 'Electrical / Functional Test Fail', count: 0 }
];

const INITIAL_AUDITS: AuditRecord[] = [
  {
    id: 'aud-1',
    timestamp: '08:15:20',
    checked: 150,
    defective: 2,
    defectPercentage: 1.33,
    status: 'Excellent',
    statusBgColor: '#DFF3E5',
    statusBorderColor: '#1B7A3A',
    statusTextColor: '#1B7A3A',
    lineId: 'Line 2 - SMT Assembly',
    batchId: 'LOT-2610A',
    inspectorName: 'J. Martinez',
    instruction: 'Keep the current method.',
    notes: 'Hourly routine audit'
  },
  {
    id: 'aud-2',
    timestamp: '09:20:45',
    checked: 200,
    defective: 7,
    defectPercentage: 3.50,
    status: 'Acceptable',
    statusBgColor: '#FFE9A8',
    statusBorderColor: '#E0A100',
    statusTextColor: '#8A5A00',
    lineId: 'Line 2 - SMT Assembly',
    batchId: 'LOT-2610B',
    inspectorName: 'J. Martinez',
    topDefect: 'Dimensional / Tolerance',
    instruction: 'Check the top defect type at the next hourly audit.',
    notes: 'Minor drift on pick-and-place feeder'
  }
];

export default function App() {
  // Input states
  const [checkedInput, setCheckedInput] = useState<string>('100');
  const [defectiveInput, setDefectiveInput] = useState<string>('2');
  const [lineId, setLineId] = useState<string>('Line 1 - Final Inspection');
  const [batchId, setBatchId] = useState<string>('LOT-2026-A104');
  const [inspectorName, setInspectorName] = useState<string>('Operator QC-44');
  const [notes, setNotes] = useState<string>('');

  // Categories
  const [categories, setCategories] = useState<DefectCategory[]>(INITIAL_CATEGORIES);
  const [syncCategories, setSyncCategories] = useState<boolean>(false);
  const [showCategoryTracker, setShowCategoryTracker] = useState<boolean>(true);

  // Result state (null when hidden/reset)
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoggedCurrent, setIsLoggedCurrent] = useState<boolean>(false);

  // Audit records state
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(INITIAL_AUDITS);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);

  // Handle calculation
  const handleCalculate = (customChecked?: number, customDefective?: number) => {
    setValidationError(null);

    const checkedVal = customChecked !== undefined ? customChecked : parseInt(checkedInput, 10);
    const defectiveVal = customDefective !== undefined ? customDefective : parseInt(defectiveInput, 10);

    if (isNaN(checkedVal) || checkedVal <= 0) {
      setValidationError('Total units checked must be a positive integer greater than 0.');
      return;
    }

    if (isNaN(defectiveVal) || defectiveVal < 0) {
      setValidationError('Defective units cannot be negative.');
      return;
    }

    if (defectiveVal > checkedVal) {
      setValidationError(`Defective units (${defectiveVal}) cannot exceed checked units (${checkedVal}).`);
      return;
    }

    const calc = calculateQCResult(checkedVal, defectiveVal, categories, {
      lineId,
      batchId,
      inspectorName,
      notes
    });

    setResult(calc);
    setIsLoggedCurrent(false);

    // Smooth scroll to result panel on mobile
    setTimeout(() => {
      document.getElementById('qc-result-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  // Handle Reset: completely clears input and HIDES result panel and colour
  const handleReset = () => {
    setCheckedInput('');
    setDefectiveInput('');
    setResult(null);
    setValidationError(null);
    setIsLoggedCurrent(false);
    setCategories(INITIAL_CATEGORIES);
  };

  // Run quick preset tests
  const handleSelectTest = (checked: number, defective: number, _label: string) => {
    setCheckedInput(checked.toString());
    setDefectiveInput(defective.toString());
    // Assign sample categories if relevant
    if (defective === 5) {
      setCategories([
        { id: 'cat-1', name: 'Surface Scratch / Cosmetic', count: 1 },
        { id: 'cat-2', name: 'Dimensional / Tolerance', count: 3 },
        { id: 'cat-3', name: 'Solder / Weld Void', count: 1 },
        { id: 'cat-4', name: 'Fastening / Missing Component', count: 0 },
        { id: 'cat-5', name: 'Packaging & Barcode Label', count: 0 },
        { id: 'cat-6', name: 'Electrical / Functional Test Fail', count: 0 }
      ]);
    } else if (defective === 6) {
      setCategories([
        { id: 'cat-1', name: 'Surface Scratch / Cosmetic', count: 2 },
        { id: 'cat-2', name: 'Dimensional / Tolerance', count: 4 },
        { id: 'cat-3', name: 'Solder / Weld Void', count: 0 },
        { id: 'cat-4', name: 'Fastening / Missing Component', count: 0 },
        { id: 'cat-5', name: 'Packaging & Barcode Label', count: 0 },
        { id: 'cat-6', name: 'Electrical / Functional Test Fail', count: 0 }
      ]);
    } else {
      setCategories([
        { id: 'cat-1', name: 'Surface Scratch / Cosmetic', count: 1 },
        { id: 'cat-2', name: 'Dimensional / Tolerance', count: 1 },
        { id: 'cat-3', name: 'Solder / Weld Void', count: 0 },
        { id: 'cat-4', name: 'Fastening / Missing Component', count: 0 },
        { id: 'cat-5', name: 'Packaging & Barcode Label', count: 0 },
        { id: 'cat-6', name: 'Electrical / Functional Test Fail', count: 0 }
      ]);
    }
    handleCalculate(checked, defective);
  };

  // When categories change and sync is enabled
  const handleCategoriesChange = (updated: DefectCategory[]) => {
    setCategories(updated);
    if (syncCategories) {
      const sum = updated.reduce((s, c) => s + c.count, 0);
      setDefectiveInput(sum.toString());
    }
  };

  const handleToggleSync = (sync: boolean) => {
    setSyncCategories(sync);
    if (sync) {
      const sum = categories.reduce((s, c) => s + c.count, 0);
      setDefectiveInput(sum.toString());
    }
  };

  // Log calculation to shift records
  const handleLogAudit = (res: CalculationResult) => {
    const newRecord: AuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: res.timestamp,
      checked: res.checked,
      defective: res.defective,
      defectPercentage: res.defectPercentage,
      status: res.statusConfig.status,
      statusBgColor: res.statusConfig.bgColor,
      statusBorderColor: res.statusConfig.borderColor,
      statusTextColor: res.statusConfig.textColor,
      lineId: res.lineId,
      batchId: res.batchId,
      inspectorName: res.inspectorName,
      topDefect: res.topDefectType?.name,
      instruction: res.statusConfig.instruction,
      notes: res.notes
    };

    setAuditRecords([newRecord, ...auditRecords]);
    setIsLoggedCurrent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 1. Universal Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand title, single line */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              QC
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              QC Defect Rate Calculator
            </span>
          </div>

          {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#calculator-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Calculator
            </a>
            <a href="#test-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Test Bands
            </a>
            <a href="#audit-log-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Shift Log
            </a>
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="hover:text-emerald-700 text-emerald-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" /> APK File (Android)
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" /> SOP Rules
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Download or build APK for Android"
            >
              <Smartphone className="w-3.5 h-3.5" />
              APK File Option
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              SOP Rules
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro / Context Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Quality Assurance & Defect Threshold System
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Industrial sampling calculator with mandatory high-visibility status color bands and whole-number precision.
            </p>
          </div>

          {/* Quick Threshold Legend Pills & APK Option */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-md border border-[#1B7A3A] bg-[#DFF3E5] text-[#1B7A3A]">
              ≤ 2% Excellent
            </span>
            <span className="px-2.5 py-1 rounded-md border border-[#E0A100] bg-[#FFE9A8] text-[#8A5A00]">
              &gt; 2% - 5% Acceptable
            </span>
            <span className="px-2.5 py-1 rounded-md border border-[#B42318] bg-[#FBD9D5] text-[#B42318]">
              &gt; 5% Action Required
            </span>
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              APK Option
            </button>
          </div>
        </div>

        {/* Quick Test Bar for Instant Verification */}
        <div id="test-section">
          <QuickTestBar onSelectTest={handleSelectTest} onReset={handleReset} />
        </div>

        {/* 2-Column Split: Calculator Form on Left, Result or Helper on Right */}
        <div id="calculator-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Inputs & Controls) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-slate-700" />
                  <h2 className="text-base font-bold text-slate-900">
                    Audit Sample Inspection
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Clear inputs and hide results"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>

              {/* Validation Warning */}
              {validationError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Main Numbers Form */}
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="checked-units" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Total Units Checked <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="checked-units"
                      type="number"
                      min="1"
                      step="1"
                      value={checkedInput}
                      onChange={(e) => setCheckedInput(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full font-mono-numbers text-xl font-bold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-semibold text-slate-400 uppercase">
                      Units
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Sample batch quantity examined by inspector
                  </p>
                </div>

                <div>
                  <label htmlFor="defective-units" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Defective Units Found <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="defective-units"
                      type="number"
                      min="0"
                      step="1"
                      value={defectiveInput}
                      onChange={(e) => setDefectiveInput(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full font-mono-numbers text-xl font-bold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-semibold text-slate-400 uppercase">
                      Rejects
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Units with any non-conformance or defect
                  </p>
                </div>

                {/* Audit Context Fields (Collapsed/Compact) */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Production Line
                      </label>
                      <input
                        type="text"
                        value={lineId}
                        onChange={(e) => setLineId(e.target.value)}
                        className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Batch / Lot No.
                      </label>
                      <input
                        type="text"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        className="w-full text-xs font-mono py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Inspector ID
                      </label>
                      <input
                        type="text"
                        value={inspectorName}
                        onChange={(e) => setInspectorName(e.target.value)}
                        className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Shift Remarks (Opt.)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hourly check"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleCalculate()}
                    className="flex-1 py-3 px-6 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Calculate Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Defect Categories Toggle */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setShowCategoryTracker(!showCategoryTracker)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                {showCategoryTracker ? 'Hide Defect Categories' : 'Show Defect Categories Breakdown'}
              </button>
              <span className="text-xs text-slate-500 font-mono-numbers">
                {categories.filter((c) => c.count > 0).length} active
              </span>
            </div>

            {/* Optional Defect Category Tracker */}
            {showCategoryTracker && (
              <DefectCategoryTracker
                categories={categories}
                onChange={handleCategoriesChange}
                syncWithTotal={syncCategories}
                onToggleSync={handleToggleSync}
                totalDefective={parseInt(defectiveInput, 10) || 0}
              />
            )}
          </div>

          {/* Right Column (Result Panel or Empty State) */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              /* Mandatory Result Panel with exact colours, 4px border, and solid top bar */
              <ResultPanel
                result={result}
                onLogAudit={handleLogAudit}
                isLogged={isLoggedCurrent}
              />
            ) : (
              /* Clean Empty State when Reset or awaiting calculation */
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <Calculator className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Ready to Calculate Quality Status
                </h3>
                <p className="text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed">
                  Enter the checked units and defective count on the left, or click one of the benchmark tests above to calculate the defect percentage and trigger the official status color band.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleSelectTest(100, 2, 'Green')}
                    className="px-3.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Run Test: 100 checked, 2 defective (Green)
                  </button>
                  <button
                    onClick={() => handleSelectTest(100, 5, 'Amber')}
                    className="px-3.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Run Test: 100 checked, 5 defective (Amber)
                  </button>
                  <button
                    onClick={() => handleSelectTest(100, 6, 'Red')}
                    className="px-3.5 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-900 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Run Test: 100 checked, 6 defective (Red)
                  </button>
                </div>
              </div>
            )}

            {/* Quick reference card for QC Operators */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Defect Rate Threshold Reference
                </span>
                <span className="text-xs text-slate-400 font-mono">ISO 2859 / AQL Rules</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-[#1B7A3A]/40 bg-[#DFF3E5]/50">
                  <div className="font-bold text-[#1B7A3A]">Defect % ≤ 2.0%</div>
                  <div className="font-extrabold uppercase mt-0.5 text-[#1B7A3A]">Excellent</div>
                  <div className="text-[11px] text-slate-700 mt-1">Keep the current method.</div>
                </div>

                <div className="p-3 rounded-lg border border-[#E0A100]/40 bg-[#FFE9A8]/50">
                  <div className="font-bold text-[#8A5A00]">2.0% &lt; Defect % ≤ 5.0%</div>
                  <div className="font-extrabold uppercase mt-0.5 text-[#8A5A00]">Acceptable</div>
                  <div className="text-[11px] text-slate-700 mt-1">Check the top defect type at the next hourly audit.</div>
                </div>

                <div className="p-3 rounded-lg border border-[#B42318]/40 bg-[#FBD9D5]/50">
                  <div className="font-bold text-[#B42318]">Defect % &gt; 5.0%</div>
                  <div className="font-extrabold uppercase mt-0.5 text-[#B42318]">Action required</div>
                  <div className="text-[11px] text-slate-700 mt-1">Stop the line and inform the QC manager.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shift Audit Log Section */}
        <section id="audit-log-section" className="pt-4">
          <ShiftAuditLog
            records={auditRecords}
            onClear={() => setAuditRecords([])}
            onDeleteRecord={(id) => setAuditRecords(auditRecords.filter((r) => r.id !== id))}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Quality Control Industrial Inspection Workbench · Strict Whole-Number Arithmetic</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              APK File Option
            </button>
            <button onClick={() => setIsModalOpen(true)} className="hover:text-slate-800 transition-colors cursor-pointer">
              SOP Guidelines
            </button>
            <a href="#test-section" className="hover:text-slate-800 transition-colors">
              Run Verification Tests
            </a>
          </div>
        </div>
      </footer>

      {/* Standards SOP Modal */}
      <StandardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Android APK & Mobile Application Modal */}
      <ApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
