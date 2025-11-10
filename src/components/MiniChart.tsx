import { memo, useMemo } from 'react';
import type { Shift } from '../types';
import { formatPercentage } from '../utils/oeeCalculations';
import { calculateShiftOEE } from '../utils/oeeCalculations';
import type { ProductionLine, DowntimeEvent } from '../types';

interface MiniChartProps {
  shifts: Shift[];
  downtimeEvents: DowntimeEvent[];
  productionLine: ProductionLine;
  title?: string;
}

function MiniChartComponent({
  shifts,
  downtimeEvents,
  productionLine,
  title = 'OEE by Shift',
}: MiniChartProps) {
  const shiftMetrics = useMemo(() => {
    return shifts.map(shift => ({
      shift,
      metrics: calculateShiftOEE(shift, downtimeEvents, productionLine),
    }));
  }, [shifts, downtimeEvents, productionLine]);

  const maxOEE = useMemo(() => {
    return Math.max(...shiftMetrics.map(sm => sm.metrics.oee), 0.01);
  }, [shiftMetrics]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {shiftMetrics.map(({ shift, metrics }) => {
          const barWidth = (metrics.oee / maxOEE) * 100;
          const statusColor = metrics.oee >= 0.85 
            ? 'bg-green-500' 
            : metrics.oee >= 0.65 
            ? 'bg-yellow-500' 
            : 'bg-red-500';

          return (
            <div key={shift.id} className="space-y-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {shift.name}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercentage(metrics.oee)}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`${statusColor} h-full transition-all duration-500 ease-out`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>A: {formatPercentage(metrics.availability)}</span>
                <span>P: {formatPercentage(metrics.performance)}</span>
                <span>Q: {formatPercentage(metrics.quality)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const MiniChart = memo(MiniChartComponent);

