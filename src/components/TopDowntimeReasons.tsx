import type { DowntimeEvent } from '../types';
import { getTopDowntimeReasons, formatDuration } from '../utils/downtimeUtils';

interface TopDowntimeReasonsProps {
  downtimeEvents: DowntimeEvent[];
  limit?: number;
  title?: string;
}

export function TopDowntimeReasons({
  downtimeEvents,
  limit = 3,
  title = 'Top Downtime Reasons',
}: TopDowntimeReasonsProps) {
  const topReasons = getTopDowntimeReasons(downtimeEvents, limit);

  if (topReasons.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-sm">No downtime events recorded</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        {topReasons.map((event, index) => {
          const typeColor = event.type === 'planned' 
            ? 'bg-blue-100 text-blue-700 border-blue-200' 
            : 'bg-red-100 text-red-700 border-red-200';
          
          return (
            <div
              key={event.id}
              className="flex items-start justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${typeColor}`}>
                    {event.type}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {event.category}
                  </span>
                </div>
                <p className="text-sm text-gray-700 ml-8">{event.reason}</p>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-lg font-semibold text-gray-900">
                  {formatDuration(event.durationMinutes)}
                </div>
                <div className="text-xs text-gray-500">
                  {event.durationMinutes} min
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

