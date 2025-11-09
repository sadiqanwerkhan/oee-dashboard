export interface ProductionLine {
  id: string;
  name: string;
  targetCycleTime: number; 
  description: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  plannedProductionTime: number;
  targetQuantity: number;
  actualQuantity: number;
  goodQuantity: number;
  defectQuantity: number;
}

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

export interface OEEMetrics {
  availability: number;
  performance: number; 
  quality: number;
  oee: number; 
}

export interface OEEDelta {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export interface PreviousPeriod {
  description: string;
  totalOEE: number;
  availability: number;
  performance: number;
  quality: number;
}

export interface Metadata {
  site: string;
  department: string;
  reportDate: string;
  worldClassOEETarget: number;
  minimumAcceptableOEE: number;
}

export interface ProductionData {
  productionLine: ProductionLine;
  shifts: Shift[];
  downtimeEvents: DowntimeEvent[];
  previousPeriod: PreviousPeriod;
  metadata: Metadata;
}

export interface DowntimeCategorySummary {
  category: string;
  totalDurationMinutes: number;
  eventCount: number;
  type: DowntimeType;
}

export type OEEStatus = 'world-class' | 'acceptable' | 'needs-attention';

export type ShiftFilter = 'all' | 'shift_1' | 'shift_2' | 'shift_3';

