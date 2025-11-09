// Production Line Types
export interface ProductionLine {
  id: string;
  name: string;
  targetCycleTime: number; // in seconds
  description: string;
}

// Shift Types
export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  plannedProductionTime: number; // in minutes
  targetQuantity: number;
  actualQuantity: number;
  goodQuantity: number;
  defectQuantity: number;
}

// Downtime Event Types
export type DowntimeType = 'planned' | 'unplanned';

export interface DowntimeEvent {
  id: string;
  shiftId: string;
  category: string;
  reason: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  type: DowntimeType;
}

// OEE Calculation Types
export interface OEEMetrics {
  availability: number; // 0-1 (0-100%)
  performance: number; // 0-1 (0-100%)
  quality: number; // 0-1 (0-100%)
  oee: number; // 0-1 (0-100%)
}

export interface OEEDelta {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

// Previous Period Data
export interface PreviousPeriod {
  description: string;
  totalOEE: number;
  availability: number;
  performance: number;
  quality: number;
}

// Metadata Types
export interface Metadata {
  site: string;
  department: string;
  reportDate: string;
  worldClassOEETarget: number;
  minimumAcceptableOEE: number;
}

// Complete Production Data Structure
export interface ProductionData {
  productionLine: ProductionLine;
  shifts: Shift[];
  downtimeEvents: DowntimeEvent[];
  previousPeriod: PreviousPeriod;
  metadata: Metadata;
}

// Downtime Category Summary
export interface DowntimeCategorySummary {
  category: string;
  totalDurationMinutes: number;
  eventCount: number;
  type: DowntimeType;
}

// OEE Status Types
export type OEEStatus = 'world-class' | 'acceptable' | 'needs-attention';

// Shift Filter Types
export type ShiftFilter = 'all' | 'shift_1' | 'shift_2' | 'shift_3';

