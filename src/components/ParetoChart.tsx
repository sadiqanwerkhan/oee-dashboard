import type { DowntimeEvent } from '../types';
import { aggregateDowntimeByCategory, formatDuration } from '../utils/downtimeUtils';

interface ParetoChartProps {
  downtimeEvents: DowntimeEvent[];
  title?: string;
}

export function ParetoChart({
  downtimeEvents,
  title = 'Pareto Analysis - Downtime Categories',
}: ParetoChartProps) {
  const categories = aggregateDowntimeByCategory(downtimeEvents);
  const sortedCategories = [...categories].sort(
    (a, b) => b.totalDurationMinutes - a.totalDurationMinutes
  );

  if (sortedCategories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-sm">No downtime events to analyze</p>
      </div>
    );
  }

  const totalDowntime = sortedCategories.reduce(
    (sum, cat) => sum + cat.totalDurationMinutes,
    0
  );

  const maxDuration = sortedCategories[0]?.totalDurationMinutes || 1;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {sortedCategories.map((category, index) => {
          const percentage = (category.totalDurationMinutes / totalDowntime) * 100;
          const barWidth = (category.totalDurationMinutes / maxDuration) * 100;
          const cumulativePercentage = sortedCategories
            .slice(0, index + 1)
            .reduce((sum, cat) => sum + (cat.totalDurationMinutes / totalDowntime) * 100, 0);

          const typeColor = category.type === 'planned' 
            ? 'bg-blue-500' 
            : 'bg-red-500';

          return (
            <div key={category.category} className="space-y-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {category.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    category.type === 'planned' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {category.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({category.eventCount} {category.eventCount === 1 ? 'event' : 'events'})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDuration(category.totalDurationMinutes)}
                  </span>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className={`${typeColor} h-full transition-all duration-500 ease-out flex items-center`}
                    style={{ width: `${barWidth}%` }}
                  >
                    {barWidth > 15 && (
                      <span className="text-xs font-medium text-white ml-2">
                        {formatDuration(category.totalDurationMinutes)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Cumulative: {cumulativePercentage.toFixed(1)}%</span>
                  {index === 0 && (
                    <span className="text-blue-600 font-medium">
                      Top contributor
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Downtime:</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatDuration(totalDowntime)}
          </span>
        </div>
      </div>
    </div>
  );
}

