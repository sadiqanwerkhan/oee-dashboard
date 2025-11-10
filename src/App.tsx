import { useState, useMemo, useCallback } from 'react';
import { OEEDisplay, ComponentBreakdown, PeriodComparison, TopDowntimeReasons, ShiftFilterComponent, ParetoChart, MiniChart, ExportButton } from './components';
import { useFilteredOEE } from './hooks';
import type { ProductionData, ShiftFilter } from './types';
import productionDataJson from './data/production-data.json';
import { getTopDowntimeReasons } from './utils/downtimeUtils';

const DATA = productionDataJson as ProductionData;

function App() {
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>('all');
  
  const oeeMetrics = useFilteredOEE(
    DATA.shifts,
    DATA.downtimeEvents,
    DATA.productionLine,
    shiftFilter
  );

  const filteredDowntimeEvents = useMemo(() => {
    if (shiftFilter === 'all') {
      return DATA.downtimeEvents;
    }
    return DATA.downtimeEvents.filter(event => event.shiftId === shiftFilter);
  }, [shiftFilter]);
  
  const topDowntimeReasons = useMemo(() => {
    return getTopDowntimeReasons(filteredDowntimeEvents, 3);
  }, [filteredDowntimeEvents]);

  const handleFilterChange = useCallback((filter: ShiftFilter) => {
    setShiftFilter(filter);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Production Line OEE Dashboard
          </h1>
          <ExportButton data={DATA} metrics={oeeMetrics} />
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Production Line:</span> {DATA.productionLine.name}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">Site:</span> {DATA.metadata.site} - {DATA.metadata.department}
          </p>
          
          <ShiftFilterComponent
            shifts={DATA.shifts}
            selectedFilter={shiftFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OEEDisplay
            metrics={oeeMetrics}
            worldClassThreshold={DATA.metadata.worldClassOEETarget}
            minimumThreshold={DATA.metadata.minimumAcceptableOEE}
          />
          
          <ComponentBreakdown metrics={oeeMetrics} />
        </div>

        <PeriodComparison
          currentMetrics={oeeMetrics}
          previousPeriod={DATA.previousPeriod}
        />

        <div className="mt-6">
          <MiniChart
            shifts={DATA.shifts}
            downtimeEvents={filteredDowntimeEvents}
            productionLine={DATA.productionLine}
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
