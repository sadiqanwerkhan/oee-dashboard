import { memo, useMemo } from 'react';
import type { OEEMetrics, OEEStatus } from '../types';
import { formatPercentage, getOEEStatus } from '../utils/oeeCalculations';

interface OEEDisplayProps {
  metrics: OEEMetrics;
  title?: string;
  worldClassThreshold?: number;
  minimumThreshold?: number;
}

const STATUS_CONFIG: Record<OEEStatus, { color: string; bgColor: string; label: string }> = {
  'world-class': {
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    label: 'World-Class',
  },
  'acceptable': {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
    label: 'Acceptable',
  },
  'needs-attention': {
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    label: 'Needs Attention',
  },
};

function OEEDisplayComponent({
  metrics,
  title = 'Overall Equipment Effectiveness',
  worldClassThreshold = 0.85,
  minimumThreshold = 0.65,
}: OEEDisplayProps) {
  const status = useMemo(
    () => getOEEStatus(metrics.oee, worldClassThreshold, minimumThreshold),
    [metrics.oee, worldClassThreshold, minimumThreshold]
  );
  
  const config = STATUS_CONFIG[status];
  
  const formattedMetrics = useMemo(() => ({
    oee: formatPercentage(metrics.oee),
    availability: formatPercentage(metrics.availability),
    performance: formatPercentage(metrics.performance),
    quality: formatPercentage(metrics.quality),
  }), [metrics.oee, metrics.availability, metrics.performance, metrics.quality]);

  return (
    <div className={`rounded-lg border-2 p-6 ${config.bgColor} ${config.color}`}>
      <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>
      
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-5xl font-bold">{formattedMetrics.oee}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} border ${config.color.replace('text-', 'border-')}`}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-xs font-medium text-gray-600 mb-1">Availability</div>
          <div className="text-2xl font-semibold text-gray-800">
            {formattedMetrics.availability}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs font-medium text-gray-600 mb-1">Performance</div>
          <div className="text-2xl font-semibold text-gray-800">
            {formattedMetrics.performance}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs font-medium text-gray-600 mb-1">Quality</div>
          <div className="text-2xl font-semibold text-gray-800">
            {formattedMetrics.quality}
          </div>
        </div>
      </div>
    </div>
  );
}

export const OEEDisplay = memo(OEEDisplayComponent);

