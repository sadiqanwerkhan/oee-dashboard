import { useMemo } from 'react';
import type { DowntimeEvent, DowntimeCategorySummary } from '../types';
import {
  getTopDowntimeReasons,
  getTopDowntimeCategories,
  aggregateDowntimeByCategory,
  getShiftDowntimeEvents,
  calculateTotalDowntime,
  filterDowntimeByType,
} from '../utils/downtimeUtils';


export function useTopDowntimeReasons(
  downtimeEvents: DowntimeEvent[],
  limit: number = 3
): DowntimeEvent[] {
  return useMemo(() => {
    return getTopDowntimeReasons(downtimeEvents, limit);
  }, [downtimeEvents, limit]);
}


export function useTopDowntimeCategories(
  downtimeEvents: DowntimeEvent[],
  limit: number = 3
): DowntimeCategorySummary[] {
  return useMemo(() => {
    return getTopDowntimeCategories(downtimeEvents, limit);
  }, [downtimeEvents, limit]);
}

export function useDowntimeByCategory(
  downtimeEvents: DowntimeEvent[]
): DowntimeCategorySummary[] {
  return useMemo(() => {
    return aggregateDowntimeByCategory(downtimeEvents);
  }, [downtimeEvents]);
}


export function useShiftDowntime(
  shiftId: string | null,
  downtimeEvents: DowntimeEvent[]
): DowntimeEvent[] {
  return useMemo(() => {
    if (!shiftId) return [];
    return getShiftDowntimeEvents(shiftId, downtimeEvents);
  }, [shiftId, downtimeEvents]);
}


export function useTotalDowntime(
  downtimeEvents: DowntimeEvent[]
): number {
  return useMemo(() => {
    return calculateTotalDowntime(downtimeEvents);
  }, [downtimeEvents]);
}


export function useDowntimeByType(
  downtimeEvents: DowntimeEvent[],
  type: 'planned' | 'unplanned' | 'all' = 'all'
): DowntimeEvent[] {
  return useMemo(() => {
    if (type === 'all') return downtimeEvents;
    return filterDowntimeByType(downtimeEvents, type);
  }, [downtimeEvents, type]);
}

