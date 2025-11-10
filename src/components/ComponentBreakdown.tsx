import { memo, useMemo } from 'react';
import type { OEEMetrics } from '../types';
import { formatPercentage } from '../utils/oeeCalculations';

interface ComponentBreakdownProps {
  metrics: OEEMetrics;
  showLabels?: boolean;
}

const COMPONENT_CONFIG = [
  {
    name: 'Availability',
    description: 'Operating Time / Planned Production Time',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    name: 'Performance',
    description: 'Actual Quantity / Ideal Quantity',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    name: 'Quality',
    description: 'Good Quantity / Actual Quantity',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
] as const;

function ComponentBreakdownComponent({
  metrics,
  showLabels = true,
}: ComponentBreakdownProps) {
  const components = useMemo(() => {
    return COMPONENT_CONFIG.map((config, index) => ({
      ...config,
      value: index === 0 ? metrics.availability : index === 1 ? metrics.performance : metrics.quality,
    }));
  }, [metrics.availability, metrics.performance, metrics.quality]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {showLabels && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Component Breakdown
        </h3>
      )}
      
      <div className="space-y-4">
        {components.map((component) => (
          <div key={component.name} className={`${component.bgColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className={`font-semibold ${component.textColor} mb-1`}>
                  {component.name}
                </div>
                <div className="text-xs text-gray-600">
                  {component.description}
                </div>
              </div>
              <div className={`text-2xl font-bold ${component.textColor}`}>
                {formatPercentage(component.value)}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`${component.color} h-full transition-all duration-500 ease-out`}
                style={{ width: `${component.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ComponentBreakdown = memo(ComponentBreakdownComponent);

