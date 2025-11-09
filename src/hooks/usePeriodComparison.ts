import { useMemo } from 'react';
import type { OEEMetrics, PreviousPeriod } from '../types';
import { calculateDelta } from '../utils/oeeCalculations';


export function usePeriodComparison(
  currentMetrics: OEEMetrics,
  previousPeriod: PreviousPeriod | null
) {
  return useMemo(() => {
    if (!previousPeriod) {
      return {
        availability: 0,
        performance: 0,
        quality: 0,
        oee: 0,
      };
    }

    return {
      availability: calculateDelta(currentMetrics.availability, previousPeriod.availability),
      performance: calculateDelta(currentMetrics.performance, previousPeriod.performance),
      quality: calculateDelta(currentMetrics.quality, previousPeriod.quality),
      oee: calculateDelta(currentMetrics.oee, previousPeriod.totalOEE),
    };
  }, [currentMetrics, previousPeriod]);
}

