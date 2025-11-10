import { describe, it, expect } from 'vitest';
import {
  calculateAvailability,
  calculatePerformance,
  calculateQuality,
  calculateOEE,
  getOEEStatus,
  formatPercentage,
  formatDelta,
} from './oeeCalculations';

describe('calculateAvailability', () => {
  it('should calculate availability correctly for normal case', () => {
    const plannedTime = 480;
    const downtime = 60;
    const result = calculateAvailability(plannedTime, downtime);
    const expected = (480 - 60) / 480;
    expect(result).toBeCloseTo(expected, 4);
  });

  it('should return 0 when planned production time is 0', () => {
    const result = calculateAvailability(0, 60);
    expect(result).toBe(0);
  });

  it('should return 0 when downtime exceeds planned time', () => {
    const result = calculateAvailability(100, 150);
    expect(result).toBe(0);
  });

  it('should return 1 when there is no downtime', () => {
    const result = calculateAvailability(480, 0);
    expect(result).toBe(1);
  });

  it('should clamp result between 0 and 1', () => {
    const result = calculateAvailability(100, 200);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe('calculatePerformance', () => {
  it('should calculate performance correctly', () => {
    const actualQuantity = 100;
    const operatingTime = 120;
    const targetCycleTime = 60;
    const result = calculatePerformance(actualQuantity, operatingTime, targetCycleTime);
    const idealQuantity = 120 / (60 / 60);
    const expected = 100 / idealQuantity;
    expect(result).toBeCloseTo(expected, 4);
  });

  it('should return 0 when operating time is 0', () => {
    const result = calculatePerformance(100, 0, 60);
    expect(result).toBe(0);
  });

  it('should return 0 when target cycle time is 0', () => {
    const result = calculatePerformance(100, 120, 0);
    expect(result).toBe(0);
  });

  it('should clamp result between 0 and 1', () => {
    const result = calculatePerformance(200, 60, 60);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe('calculateQuality', () => {
  it('should calculate quality correctly', () => {
    const goodQuantity = 95;
    const actualQuantity = 100;
    const result = calculateQuality(goodQuantity, actualQuantity);
    expect(result).toBe(0.95);
  });

  it('should return 0 when actual quantity is 0', () => {
    const result = calculateQuality(50, 0);
    expect(result).toBe(0);
  });

  it('should return 1 when all parts are good', () => {
    const result = calculateQuality(100, 100);
    expect(result).toBe(1);
  });

  it('should clamp result between 0 and 1', () => {
    const result = calculateQuality(150, 100);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe('calculateOEE', () => {
  it('should calculate OEE as product of availability, performance, and quality', () => {
    const availability = 0.9;
    const performance = 0.8;
    const quality = 0.95;
    const result = calculateOEE(availability, performance, quality);
    const expected = 0.9 * 0.8 * 0.95;
    expect(result).toBeCloseTo(expected, 4);
  });

  it('should return 0 when any component is 0', () => {
    expect(calculateOEE(0, 0.8, 0.95)).toBe(0);
    expect(calculateOEE(0.9, 0, 0.95)).toBe(0);
    expect(calculateOEE(0.9, 0.8, 0)).toBe(0);
  });

  it('should return 1 when all components are 1', () => {
    expect(calculateOEE(1, 1, 1)).toBe(1);
  });
});

describe('getOEEStatus', () => {
  it('should return world-class for OEE >= 85%', () => {
    expect(getOEEStatus(0.85)).toBe('world-class');
    expect(getOEEStatus(0.90)).toBe('world-class');
    expect(getOEEStatus(1.0)).toBe('world-class');
  });

  it('should return acceptable for OEE between 65% and 85%', () => {
    expect(getOEEStatus(0.65)).toBe('acceptable');
    expect(getOEEStatus(0.75)).toBe('acceptable');
    expect(getOEEStatus(0.849)).toBe('acceptable');
  });

  it('should return needs-attention for OEE < 65%', () => {
    expect(getOEEStatus(0.64)).toBe('needs-attention');
    expect(getOEEStatus(0.50)).toBe('needs-attention');
    expect(getOEEStatus(0)).toBe('needs-attention');
  });

  it('should use custom thresholds when provided', () => {
    expect(getOEEStatus(0.80, 0.90, 0.70)).toBe('acceptable');
    expect(getOEEStatus(0.95, 0.90, 0.70)).toBe('world-class');
  });
});

describe('formatPercentage', () => {
  it('should format decimal as percentage string', () => {
    expect(formatPercentage(0.85)).toBe('85.0%');
    expect(formatPercentage(0.5)).toBe('50.0%');
    expect(formatPercentage(1)).toBe('100.0%');
  });

  it('should use custom decimal places', () => {
    expect(formatPercentage(0.8567, 2)).toBe('85.67%');
    expect(formatPercentage(0.5, 0)).toBe('50%');
  });
});

describe('formatDelta', () => {
  it('should format positive delta with plus sign', () => {
    expect(formatDelta(0.1)).toBe('+10.0%');
    expect(formatDelta(0.05)).toBe('+5.0%');
  });

  it('should format negative delta without plus sign', () => {
    expect(formatDelta(-0.1)).toBe('-10.0%');
    expect(formatDelta(-0.05)).toBe('-5.0%');
  });

  it('should format zero delta', () => {
    expect(formatDelta(0)).toBe('+0.0%');
  });

  it('should use custom decimal places', () => {
    expect(formatDelta(0.1234, 2)).toBe('+12.34%');
  });
});

