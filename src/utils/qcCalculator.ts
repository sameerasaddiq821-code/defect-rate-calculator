import { StatusConfig, QCStatus, CalculationResult, DefectCategory } from '../types/qc';

export const STATUS_CONFIGS: Record<QCStatus, StatusConfig> = {
  'Excellent': {
    status: 'Excellent',
    bgColor: '#DFF3E5',
    borderColor: '#1B7A3A',
    textColor: '#1B7A3A',
    barColor: '#1B7A3A',
    instruction: 'Keep the current method.',
    description: 'Defect rate is 2% or less. Quality parameters are within high-performance target standards.'
  },
  'Acceptable': {
    status: 'Acceptable',
    bgColor: '#FFE9A8',
    borderColor: '#E0A100',
    textColor: '#8A5A00',
    barColor: '#E0A100',
    instruction: 'Check the top defect type at the next hourly audit.',
    description: 'Defect rate is above 2% and up to 5%. Normal operation with elevated vigilance required on primary defect types.'
  },
  'Action required': {
    status: 'Action required',
    bgColor: '#FBD9D5',
    borderColor: '#B42318',
    textColor: '#B42318',
    barColor: '#B42318',
    instruction: 'Stop the line and inform the QC manager.',
    description: 'Defect rate exceeds 5%. Process threshold breached. Immediate containment and escalation mandatory.'
  }
};

/**
 * Calculates QC Status using whole numbers to prevent floating point rounding errors:
 * - Exactly 2% is green: defective * 100 <= 2 * checked
 * - Exactly 5% is amber: defective * 100 <= 5 * checked
 * - Above 5% is red: defective * 100 > 5 * checked
 */
export function determineQCStatus(checked: number, defective: number): StatusConfig {
  if (checked <= 0) {
    return STATUS_CONFIGS['Excellent'];
  }

  // Whole number arithmetic comparison to avoid rounding errors
  // E.g.: defective * 100 <= 2 * checked
  if (defective * 100 <= 2 * checked) {
    return STATUS_CONFIGS['Excellent'];
  }

  // defective * 100 <= 5 * checked
  if (defective * 100 <= 5 * checked) {
    return STATUS_CONFIGS['Acceptable'];
  }

  return STATUS_CONFIGS['Action required'];
}

export function calculateQCResult(
  checked: number,
  defective: number,
  categories: DefectCategory[] = [],
  metadata: { lineId?: string; batchId?: string; inspectorName?: string; notes?: string } = {}
): CalculationResult {
  const statusConfig = determineQCStatus(checked, defective);
  const defectPercentage = checked > 0 ? (defective / checked) * 100 : 0;
  const passed = Math.max(0, checked - defective);

  // Identify top defect type if category tracking is used
  let topDefectType: { name: string; count: number; percentage: number } | undefined;
  const activeCategories = categories.filter((c) => c.count > 0);
  if (activeCategories.length > 0) {
    const sorted = [...activeCategories].sort((a, b) => b.count - a.count);
    const top = sorted[0];
    const totalCategorized = categories.reduce((sum, c) => sum + c.count, 0) || defective || 1;
    topDefectType = {
      name: top.name,
      count: top.count,
      percentage: Number(((top.count / totalCategorized) * 100).toFixed(1))
    };
  }

  return {
    checked,
    defective,
    defectPercentage,
    passed,
    statusConfig,
    topDefectType,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    lineId: metadata.lineId || 'Line 1 - Primary',
    batchId: metadata.batchId || `LOT-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}`,
    inspectorName: metadata.inspectorName || 'Operator QC',
    notes: metadata.notes
  };
}
