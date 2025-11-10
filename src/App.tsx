import { useState, useMemo, useCallback } from 'react';
import { OEEDisplay, ComponentBreakdown, PeriodComparison, TopDowntimeReasons, ShiftFilterComponent, ParetoChart, MiniChart, ExportButton, LoadingSpinner, ErrorDisplay } from './components';
import { useFilteredOEE, useProductionData } from './hooks';
import type { ShiftFilter } from './types';
import { getTopDowntimeReasons } from './utils/downtimeUtils';

function App() {
  const { data, loading, error } = useProductionData();
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>('all');

  const handleFilterChange = useCallback((filter: ShiftFilter) => {
    setShiftFilter(filter);
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const oeeMetrics = useFilteredOEE(
    data?.shifts ?? [],
    data?.downtimeEvents ?? [],
    data?.productionLine ?? { id: '', name: '', targetCycleTime: 0, description: '' },
    shiftFilter
  );

  const filteredDowntimeEvents = useMemo(() => {
    if (!data) return [];
    if (shiftFilter === 'all') {
      return data.downtimeEvents;
    }
    return data.downtimeEvents.filter(event => event.shiftId === shiftFilter);
  }, [data, shiftFilter]);
  
  const topDowntimeReasons = useMemo(() => {
    return getTopDowntimeReasons(filteredDowntimeEvents, 3);
  }, [filteredDowntimeEvents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner message="Loading production data..." size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay 
            message={error || 'Failed to load production data'} 
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Production Line OEE Dashboard
          </h1>
          <ExportButton data={data} metrics={oeeMetrics} />
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Production Line:</span> {data.productionLine.name}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">Site:</span> {data.metadata.site} - {data.metadata.department}
          </p>
          
          <ShiftFilterComponent
            shifts={data.shifts}
            selectedFilter={shiftFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OEEDisplay
            metrics={oeeMetrics}
            worldClassThreshold={data.metadata.worldClassOEETarget}
            minimumThreshold={data.metadata.minimumAcceptableOEE}
          />
          
          <ComponentBreakdown metrics={oeeMetrics} />
        </div>

        <PeriodComparison
          currentMetrics={oeeMetrics}
          previousPeriod={data.previousPeriod}
        />

        <div className="mt-6">
          <MiniChart
            shifts={data.shifts}
            downtimeEvents={filteredDowntimeEvents}
            productionLine={data.productionLine}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopDowntimeReasons
            downtimeEvents={topDowntimeReasons}
            limit={3}
          />
          
          <ParetoChart
            downtimeEvents={filteredDowntimeEvents}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
