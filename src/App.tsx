import { useState } from 'react';
import { OEEDisplay, ComponentBreakdown, PeriodComparison, TopDowntimeReasons, ShiftFilterComponent } from './components';
import { useFilteredOEE } from './hooks';
import type { ProductionData, ShiftFilter } from './types';
import productionDataJson from './data/production-data.json';
import { getTopDowntimeReasons } from './utils/downtimeUtils';

function App() {
  const data = productionDataJson as ProductionData;
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>('all');
  
  const oeeMetrics = useFilteredOEE(
    data.shifts,
    data.downtimeEvents,
    data.productionLine,
    shiftFilter
  );

  const filteredDowntimeEvents = shiftFilter === 'all'
    ? data.downtimeEvents
    : data.downtimeEvents.filter(event => event.shiftId === shiftFilter);
  
  const topDowntimeReasons = getTopDowntimeReasons(filteredDowntimeEvents, 3);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Production Line OEE Dashboard
        </h1>
        
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
            onFilterChange={setShiftFilter}
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
          <TopDowntimeReasons
            downtimeEvents={topDowntimeReasons}
            limit={3}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
