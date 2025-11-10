import { memo, useCallback, useMemo } from 'react';
import type { ProductionData, OEEMetrics } from '../types';
import { exportToJSON, exportToCSV, downloadFile } from '../utils/exportUtils';

interface ExportButtonProps {
  data: ProductionData;
  metrics: OEEMetrics;
}

function ExportButtonComponent({ data, metrics }: ExportButtonProps) {
  const filename = useMemo(() => {
    return `oee-dashboard-${data.metadata.reportDate}`;
  }, [data.metadata.reportDate]);

  const handleExportJSON = useCallback(() => {
    const jsonContent = exportToJSON(data, metrics);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }, [data, metrics, filename]);

  const handleExportCSV = useCallback(() => {
    const csvContent = exportToCSV(data, metrics);
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }, [data, metrics, filename]);

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportJSON}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export JSON
      </button>
      
      <button
        onClick={handleExportCSV}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </button>
    </div>
  );
}

export const ExportButton = memo(ExportButtonComponent);

