import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredOEE } from './useOEE';
import type { Shift, DowntimeEvent, ProductionLine } from '../types';

const mockProductionLine: ProductionLine = {
  id: 'LINE_1',
  name: 'Test Line',
  targetCycleTime: 60,
  description: 'Test production line',
};

const mockShifts: Shift[] = [
  {
    id: 'SHIFT_1',
    name: 'Shift 1',
    startTime: '2025-01-01T06:00:00Z',
    endTime: '2025-01-01T14:00:00Z',
    plannedProductionTime: 480,
    targetQuantity: 480,
    actualQuantity: 400,
    goodQuantity: 380,
    defectQuantity: 20,
  },
  {
    id: 'SHIFT_2',
    name: 'Shift 2',
    startTime: '2025-01-01T14:00:00Z',
    endTime: '2025-01-01T22:00:00Z',
    plannedProductionTime: 480,
    targetQuantity: 480,
    actualQuantity: 450,
    goodQuantity: 440,
    defectQuantity: 10,
  },
];

const mockDowntimeEvents: DowntimeEvent[] = [
  {
    id: 'DT_1',
    shiftId: 'SHIFT_1',
    category: 'Machine Failure',
    reason: 'Test failure',
    startTime: '2025-01-01T08:00:00Z',
    endTime: '2025-01-01T09:00:00Z',
    durationMinutes: 60,
    type: 'unplanned',
  },
];

describe('useFilteredOEE', () => {
  it('should calculate full day OEE when filter is "all"', () => {
    const { result } = renderHook(() =>
      useFilteredOEE(mockShifts, mockDowntimeEvents, mockProductionLine, 'all')
    );

    expect(result.current).toHaveProperty('oee');
    expect(result.current).toHaveProperty('availability');
    expect(result.current).toHaveProperty('performance');
    expect(result.current).toHaveProperty('quality');
    expect(result.current.oee).toBeGreaterThanOrEqual(0);
    expect(result.current.oee).toBeLessThanOrEqual(1);
  });

  it('should calculate OEE for specific shift when filter is shift ID', () => {
    const { result } = renderHook(() =>
      useFilteredOEE(mockShifts, mockDowntimeEvents, mockProductionLine, 'SHIFT_1')
    );

    expect(result.current).toHaveProperty('oee');
    expect(result.current.oee).toBeGreaterThanOrEqual(0);
    expect(result.current.oee).toBeLessThanOrEqual(1);
  });

  it('should return zero metrics when shift ID is not found', () => {
    const { result } = renderHook(() =>
      useFilteredOEE(mockShifts, mockDowntimeEvents, mockProductionLine, 'NON_EXISTENT')
    );

    expect(result.current.oee).toBe(0);
    expect(result.current.availability).toBe(0);
    expect(result.current.performance).toBe(0);
    expect(result.current.quality).toBe(0);
  });

  it('should memoize results when dependencies do not change', () => {
    const { result, rerender } = renderHook(
      ({ filter }: { filter: 'all' | string }) => useFilteredOEE(mockShifts, mockDowntimeEvents, mockProductionLine, filter),
      { initialProps: { filter: 'all' } }
    );

    const firstResult = result.current;

    rerender({ filter: 'all' });

    expect(result.current).toBe(firstResult);
  });

  it('should recalculate when shift filter changes', () => {
    const { result, rerender } = renderHook(
      ({ filter }: { filter: 'all' | string }) => useFilteredOEE(mockShifts, mockDowntimeEvents, mockProductionLine, filter),
      { initialProps: { filter: 'all' } }
    );

    const allShiftsResult = result.current.oee;

    rerender({ filter: 'SHIFT_1' });

    expect(result.current.oee).not.toBe(allShiftsResult);
  });
});

