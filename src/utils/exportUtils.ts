import type { ProductionData, OEEMetrics } from '../types';
import { calculateShiftOEE } from './oeeCalculations';

export function exportToJSON(data: ProductionData, metrics: OEEMetrics): string {
  const exportData = {
    metadata: data.metadata,
    productionLine: data.productionLine,
    reportDate: new Date().toISOString(),
    oeeMetrics: metrics,
    shifts: data.shifts,
    downtimeEvents: data.downtimeEvents,
    previousPeriod: data.previousPeriod,
  };

  return JSON.stringify(exportData, null, 2);
}

export function exportToCSV(data: ProductionData, metrics: OEEMetrics): string {
  const headers = [
    'Metric',
    'Value',
    'Percentage',
  ];

  const rows = [
    ['OEE', metrics.oee.toFixed(4), `${(metrics.oee * 100).toFixed(1)}%`],
    ['Availability', metrics.availability.toFixed(4), `${(metrics.availability * 100).toFixed(1)}%`],
    ['Performance', metrics.performance.toFixed(4), `${(metrics.performance * 100).toFixed(1)}%`],
    ['Quality', metrics.quality.toFixed(4), `${(metrics.quality * 100).toFixed(1)}%`],
    ['', '', ''],
    ['Shift', 'OEE', 'Availability', 'Performance', 'Quality'],
  ];

  data.shifts.forEach(shift => {
    const shiftOEE = calculateShiftOEE(shift, data.downtimeEvents, data.productionLine);
    rows.push([
      shift.name,
      shiftOEE.oee.toFixed(4),
      shiftOEE.availability.toFixed(4),
      shiftOEE.performance.toFixed(4),
      shiftOEE.quality.toFixed(4),
    ]);
  });

  rows.push(['', '', '', '', '']);
  rows.push(['Downtime Event', 'Category', 'Type', 'Duration (min)', 'Shift']);

  data.downtimeEvents.forEach(event => {
    const shift = data.shifts.find(s => s.id === event.shiftId);
    rows.push([
      event.reason,
      event.category,
      event.type,
      event.durationMinutes.toString(),
      shift?.name || event.shiftId,
    ]);
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
}


export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

