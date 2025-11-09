import type { DowntimeEvent, DowntimeCategorySummary } from '../types';

export function getShiftDowntimeEvents(
  shiftId: string,
  downtimeEvents: DowntimeEvent[]
): DowntimeEvent[] {
  return downtimeEvents.filter(event => event.shiftId === shiftId);
}

export function getMultipleShiftsDowntimeEvents(
  shiftIds: string[],
  downtimeEvents: DowntimeEvent[]
): DowntimeEvent[] {
  return downtimeEvents.filter(event => shiftIds.includes(event.shiftId));
}

export function aggregateDowntimeByCategory(
  downtimeEvents: DowntimeEvent[]
): DowntimeCategorySummary[] {
  const categoryMap = new Map<string, DowntimeCategorySummary>();

  downtimeEvents.forEach(event => {
    const existing = categoryMap.get(event.category);
    
    if (existing) {
      existing.totalDurationMinutes += event.durationMinutes;
      existing.eventCount += 1;
    } else {
      categoryMap.set(event.category, {
        category: event.category,
        totalDurationMinutes: event.durationMinutes,
        eventCount: 1,
        type: event.type,
      });
    }
  });

  return Array.from(categoryMap.values());
}

export function getTopDowntimeReasons(
  downtimeEvents: DowntimeEvent[],
  limit: number = 3
): DowntimeEvent[] {
  return [...downtimeEvents]
    .sort((a, b) => b.durationMinutes - a.durationMinutes)
    .slice(0, limit);
}

export function getTopDowntimeCategories(
  downtimeEvents: DowntimeEvent[],
  limit: number = 3
): DowntimeCategorySummary[] {
  const aggregated = aggregateDowntimeByCategory(downtimeEvents);
  
  return aggregated
    .sort((a, b) => b.totalDurationMinutes - a.totalDurationMinutes)
    .slice(0, limit);
}

export function calculateTotalDowntime(
  downtimeEvents: DowntimeEvent[]
): number {
  return downtimeEvents.reduce(
    (total, event) => total + event.durationMinutes,
    0
  );
}

export function filterDowntimeByType(
  downtimeEvents: DowntimeEvent[],
  type: 'planned' | 'unplanned'
): DowntimeEvent[] {
  return downtimeEvents.filter(event => event.type === type);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}
