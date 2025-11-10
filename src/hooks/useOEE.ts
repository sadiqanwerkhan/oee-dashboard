import { useMemo } from 'react';
import type { Shift, DowntimeEvent, ProductionLine, OEEMetrics } from '../types';
import {
  calculateShiftOEE,
  calculateFullDayOEE,
} from '../utils/oeeCalculations';


export function useShiftOEE(
  shift: Shift | null,
  downtimeEvents: DowntimeEvent[],
  productionLine: ProductionLine
): OEEMetrics | null {
  return useMemo(() => {
    if (!shift) return null;
    
    return calculateShiftOEE(shift, downtimeEvents, productionLine);
  }, [shift, downtimeEvents, productionLine]);
}


export function useFullDayOEE(
  shifts: Shift[],
  downtimeEvents: DowntimeEvent[],
  productionLine: ProductionLine
): OEEMetrics {
  return useMemo(() => {
    return calculateFullDayOEE(shifts, downtimeEvents, productionLine);
  }, [shifts, downtimeEvents, productionLine]);
}


export function useFilteredOEE(
  shifts: Shift[],
  downtimeEvents: DowntimeEvent[],
  productionLine: ProductionLine,
  shiftFilter: 'all' | string
): OEEMetrics {
  const shiftMap = useMemo(() => {
    const map = new Map<string, Shift>();
    shifts.forEach(shift => map.set(shift.id, shift));
    return map;
  }, [shifts]);

  return useMemo(() => {
    if (shiftFilter === 'all') {
      return calculateFullDayOEE(shifts, downtimeEvents, productionLine);
    }
    
    const filteredShift = shiftMap.get(shiftFilter);
    if (!filteredShift) {
      return {
        availability: 0,
        performance: 0,
        quality: 0,
        oee: 0,
      };
    }
    
    return calculateShiftOEE(filteredShift, downtimeEvents, productionLine);
  }, [shifts, downtimeEvents, productionLine, shiftFilter, shiftMap]);
}

