export type QCStatus = 'Excellent' | 'Acceptable' | 'Action required';

export interface StatusConfig {
  status: QCStatus;
  bgColor: string;
  borderColor: string;
  textColor: string;
  barColor: string;
  instruction: string;
  description: string;
}

export interface DefectCategory {
  id: string;
  name: string;
  count: number;
}

export interface CalculationResult {
  checked: number;
  defective: number;
  defectPercentage: number;
  passed: number;
  statusConfig: StatusConfig;
  topDefectType?: { name: string; count: number; percentage: number };
  timestamp: string;
  lineId: string;
  batchId: string;
  inspectorName: string;
  notes?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  checked: number;
  defective: number;
  defectPercentage: number;
  status: QCStatus;
  statusBgColor: string;
  statusBorderColor: string;
  statusTextColor: string;
  lineId: string;
  batchId: string;
  inspectorName: string;
  topDefect?: string;
  instruction: string;
  notes?: string;
}
