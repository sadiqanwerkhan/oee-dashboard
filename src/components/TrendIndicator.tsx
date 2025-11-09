import { formatDelta } from '../utils/oeeCalculations';

interface TrendIndicatorProps {
  delta: number;
  showArrow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TrendIndicator({
  delta,
  showArrow = true,
  size = 'md',
}: TrendIndicatorProps) {
  const isPositive = delta >= 0;
  const isNeutral = delta === 0;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const deltaColor = isNeutral 
    ? 'text-gray-600 bg-gray-50' 
    : isPositive 
    ? 'text-green-600 bg-green-50' 
    : 'text-red-600 bg-red-50';
  
  const arrow = isNeutral ? '→' : isPositive ? '↑' : '↓';
  const arrowColor = isNeutral 
    ? 'text-gray-500' 
    : isPositive 
    ? 'text-green-600' 
    : 'text-red-600';

  return (
    <div className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${deltaColor}`}>
      {showArrow && (
        <span className={arrowColor} aria-hidden="true">
          {arrow}
        </span>
      )}
      <span>{formatDelta(delta)}</span>
    </div>
  );
}

