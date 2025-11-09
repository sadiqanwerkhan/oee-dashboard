import type { DowntimeEvent, DowntimeCategorySummary } from '../types';

/**
 * Get downtime events for a specific shift
 */
export function getShiftDowntimeEvents(
  shiftId: string,
  downtimeEvents: DowntimeEvent[]
): DowntimeEvent[] {
  return downtimeEvents.filter(event => event.shiftId === shiftId);
}

/**
 * Get downtime events for multiple shifts
 */
export function getMultipleShiftsDowntimeEvents(
  shiftIds: string[],
  downtimeEvents: DowntimeEvent[]
): DowntimeEvent[] {
  return downtimeEvents.filter(event => shiftIds.includes(event.shiftId));
}

/**
 * Aggregate downtime events by category
 */
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

/**
 * Get top N downtime reasons sorted by duration
 */
export function getTopDowntimeReasons(
  downtimeEvents: DowntimeEvent[],
  limit: number = 3
): DowntimeEvent[] {
  return [...downtimeEvents]
    .sort((a, b) => b.durationMinutes - a.durationMinutes)
    .slice(0, limit);
}

/**
 * Get top N downtime categories sorted by total duration
 */
export function getTopDowntimeCategories(
  downtimeEvents: DowntimeEvent[],
  limit: number = 3
): DowntimeCategorySummary[] {
  const aggregated = aggregateDowntimeByCategory(downtimeEvents);
  
  return aggregated
    .sort((a, b) => b.totalDurationMinutes - a.totalDurationMinutes)
    .slice(0, limit);
}

/**
 * Calculate total downtime for given events
 */
export function calculateTotalDowntime(
  downtimeEvents: DowntimeEvent[]
): number {
  return downtimeEvents.reduce(
    (total, event) => total + event.durationMinutes,
    0
  );
}

/**
 * Filter downtime events by type (planned/unplanned)
 */
export function filterDowntimeByType(
  downtimeEvents: DowntimeEvent[],
  type: 'planned' | 'unplanned'
): DowntimeEvent[] {
  return downtimeEvents.filter(event => event.type === type);
}

/**
 * Format duration in minutes to human-readable string
 */
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

