import type { Shift, DowntimeEvent, ProductionLine, OEEMetrics, OEEStatus } from '../types';

export function calculateAvailability(
  plannedProductionTime: number,
  downtimeMinutes: number
): number {
  if (plannedProductionTime === 0) return 0;
  
  const operatingTime = plannedProductionTime - downtimeMinutes;
  const availability = operatingTime / plannedProductionTime;
  
  return Math.max(0, Math.min(1, availability)); 
}

export function calculatePerformance(
  actualQuantity: number,
  operatingTimeMinutes: number,
  targetCycleTimeSeconds: number
): number {
  if (operatingTimeMinutes === 0 || targetCycleTimeSeconds === 0) return 0;
  
  const targetCycleTimeMinutes = targetCycleTimeSeconds / 60;
  const idealQuantity = operatingTimeMinutes / targetCycleTimeMinutes;
  
  if (idealQuantity === 0) return 0;
  
  const performance = actualQuantity / idealQuantity;
  
  return Math.max(0, Math.min(1, performance));
}

export function calculateQuality(
  goodQuantity: number,
  actualQuantity: number
): number {
  if (actualQuantity === 0) return 0;
  
  const quality = goodQuantity / actualQuantity;
  
  return Math.max(0, Math.min(1, quality));
}

export function calculateOEE(
  availability: number,
  performance: number,
  quality: number
): number {
  return availability * performance * quality;
}

export function getShiftDowntime(
  shiftId: string,
  downtimeEvents: DowntimeEvent[]
): number {
  return downtimeEvents
    .filter(event => event.shiftId === shiftId)
    .reduce((total, event) => total + event.durationMinutes, 0);
}

export function calculateShiftOEE(
  shift: Shift,
  downtimeEvents: DowntimeEvent[],
  productionLine: ProductionLine
): OEEMetrics {
  const downtimeMinutes = getShiftDowntime(shift.id, downtimeEvents);
  const operatingTimeMinutes = shift.plannedProductionTime - downtimeMinutes;
  
  const availability = calculateAvailability(
    shift.plannedProductionTime,
    downtimeMinutes
  );
  
  const performance = calculatePerformance(
    shift.actualQuantity,
    operatingTimeMinutes,
    productionLine.targetCycleTime
  );
  
  const quality = calculateQuality(
    shift.goodQuantity,
    shift.actualQuantity
  );
  
  const oee = calculateOEE(availability, performance, quality);
  
  return {
    availability,
    performance,
    quality,
    oee,
  };
}

export function calculateFullDayOEE(
  shifts: Shift[],
  downtimeEvents: DowntimeEvent[],
  productionLine: ProductionLine
): OEEMetrics {
  const totalPlannedTime = shifts.reduce(
    (sum, shift) => sum + shift.plannedProductionTime,
    0
  );
  
  const totalDowntime = downtimeEvents.reduce(
    (sum, event) => sum + event.durationMinutes,
    0
  );
  
  const availability = calculateAvailability(totalPlannedTime, totalDowntime);
  
  const totalActualQuantity = shifts.reduce(
    (sum, shift) => sum + shift.actualQuantity,
    0
  );

  const totalGoodQuantity = shifts.reduce(
    (sum, shift) => sum + shift.goodQuantity,
    0
  );
   
  const totalOperatingTime = totalPlannedTime - totalDowntime;
  
  const performance = calculatePerformance(
    totalActualQuantity,
    totalOperatingTime,
    productionLine.targetCycleTime
  );
  
  const quality = calculateQuality(totalGoodQuantity, totalActualQuantity);
  

  const oee = calculateOEE(availability, performance, quality);
  
  return {
    availability,
    performance,
    quality,
    oee,
  };
}

export function getOEEStatus(
  oee: number,
  worldClassThreshold: number = 0.85,
  minimumThreshold: number = 0.65
): OEEStatus {
  if (oee >= worldClassThreshold) {
    return 'world-class';
  } else if (oee >= minimumThreshold) {
    return 'acceptable';
  } else {
    return 'needs-attention';
  }
}


export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function calculateDelta(current: number, previous: number): number {
  return current - previous;
}

export function formatDelta(delta: number, decimals: number = 1): string {
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${(delta * 100).toFixed(decimals)}%`;
}

