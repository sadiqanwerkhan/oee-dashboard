import { memo, useMemo } from 'react';
import type { OEEMetrics, PreviousPeriod } from '../types';
import { formatPercentage, calculateDelta } from '../utils/oeeCalculations';
import { TrendIndicator } from './TrendIndicator';

interface PeriodComparisonProps {
  currentMetrics: OEEMetrics;
  previousPeriod: PreviousPeriod | null;
}

function PeriodComparisonComponent({
  currentMetrics,
  previousPeriod,
}: PeriodComparisonProps) {
  const deltas = useMemo(() => {
    if (!previousPeriod) return null;
    
    return {
      availability: calculateDelta(currentMetrics.availability, previousPeriod.availability),
      performance: calculateDelta(currentMetrics.performance, previousPeriod.performance),
      quality: calculateDelta(currentMetrics.quality, previousPeriod.quality),
      oee: calculateDelta(currentMetrics.oee, previousPeriod.totalOEE),
    };
  }, [currentMetrics, previousPeriod]);

  const metrics = useMemo(() => {
    if (!previousPeriod || !deltas) return null;
    
    return [
      {
        label: 'OEE',
        current: currentMetrics.oee,
        previous: previousPeriod.totalOEE,
        delta: deltas.oee,
      },
      {
        label: 'Availability',
        current: currentMetrics.availability,
        previous: previousPeriod.availability,
        delta: deltas.availability,
      },
      {
        label: 'Performance',
        current: currentMetrics.performance,
        previous: previousPeriod.performance,
        delta: deltas.performance,
      },
      {
        label: 'Quality',
        current: currentMetrics.quality,
        previous: previousPeriod.quality,
        delta: deltas.quality,
      },
    ];
  }, [currentMetrics, previousPeriod, deltas]);

  if (!previousPeriod || !metrics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Period Comparison
        </h3>
        <p className="text-gray-500 text-sm">No previous period data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Period Comparison
      </h3>
      <p className="text-xs text-gray-500 mb-4">{previousPeriod.description}</p>
      
      <div className="space-y-3">
        {metrics.map((metric) => {
          return (
            <div
              key={metric.label}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-medium text-gray-700">
                    {metric.label}
                  </div>
                  <TrendIndicator delta={metric.delta} size="sm" />
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatPercentage(metric.current)}
                  </div>
                  <div className="text-xs text-gray-500">
                    was {formatPercentage(metric.previous)}
                  </div>
                </div>
              </div>
              
              <TrendIndicator delta={metric.delta} size="md" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const PeriodComparison = memo(PeriodComparisonComponent);

