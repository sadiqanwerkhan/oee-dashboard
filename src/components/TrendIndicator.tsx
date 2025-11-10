import { memo, useMemo } from 'react';
import { formatDelta } from '../utils/oeeCalculations';

interface TrendIndicatorProps {
  delta: number;
  showArrow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
} as const;

function TrendIndicatorComponent({
  delta,
  showArrow = true,
  size = 'md',
}: TrendIndicatorProps) {
  const { deltaColor, arrow, arrowColor, formattedDelta } = useMemo(() => {
    const isPositive = delta >= 0;
    const isNeutral = delta === 0;
    
    return {
      deltaColor: isNeutral 
        ? 'text-gray-600 bg-gray-50' 
        : isPositive 
        ? 'text-green-600 bg-green-50' 
        : 'text-red-600 bg-red-50',
      arrow: isNeutral ? '→' : isPositive ? '↑' : '↓',
      arrowColor: isNeutral 
        ? 'text-gray-500' 
        : isPositive 
        ? 'text-green-600' 
        : 'text-red-600',
      formattedDelta: formatDelta(delta),
    };
  }, [delta]);

  return (
    <div className={`inline-flex items-center gap-1 rounded-full font-medium ${SIZE_CLASSES[size]} ${deltaColor}`}>
      {showArrow && (
        <span className={arrowColor} aria-hidden="true">
          {arrow}
        </span>
      )}
      <span>{formattedDelta}</span>
    </div>
  );
}

export const TrendIndicator = memo(TrendIndicatorComponent);

