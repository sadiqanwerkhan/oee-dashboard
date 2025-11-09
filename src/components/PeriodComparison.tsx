import type { OEEMetrics, PreviousPeriod } from '../types';
import { formatPercentage, formatDelta, calculateDelta } from '../utils/oeeCalculations';

interface PeriodComparisonProps {
  currentMetrics: OEEMetrics;
  previousPeriod: PreviousPeriod | null;
}

export function PeriodComparison({
  currentMetrics,
  previousPeriod,
}: PeriodComparisonProps) {
  if (!previousPeriod) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Period Comparison
        </h3>
        <p className="text-gray-500 text-sm">No previous period data available</p>
      </div>
    );
  }

  const deltas = {
    availability: calculateDelta(currentMetrics.availability, previousPeriod.availability),
    performance: calculateDelta(currentMetrics.performance, previousPeriod.performance),
    quality: calculateDelta(currentMetrics.quality, previousPeriod.quality),
    oee: calculateDelta(currentMetrics.oee, previousPeriod.totalOEE),
  };

  const metrics = [
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Period Comparison
      </h3>
      <p className="text-xs text-gray-500 mb-4">{previousPeriod.description}</p>
      
      <div className="space-y-3">
        {metrics.map((metric) => {
          const isPositive = metric.delta >= 0;
          const deltaColor = isPositive ? 'text-green-600' : 'text-red-600';
          const deltaBgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
          const arrow = isPositive ? '↑' : '↓';

          return (
            <div
              key={metric.label}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {metric.label}
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
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${deltaBgColor} ${deltaColor} flex items-center gap-1`}>
                <span>{arrow}</span>
                <span>{formatDelta(metric.delta)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

