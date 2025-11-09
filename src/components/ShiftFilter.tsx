import type { Shift, ShiftFilter } from '../types';

interface ShiftFilterProps {
  shifts: Shift[];
  selectedFilter: ShiftFilter;
  onFilterChange: (filter: ShiftFilter) => void;
}

export function ShiftFilterComponent({
  shifts,
  selectedFilter,
  onFilterChange,
}: ShiftFilterProps) {
  const filterOptions: { value: ShiftFilter; label: string }[] = [
    { value: 'all', label: 'All Shifts' },
    ...shifts.map((shift) => ({
      value: shift.id,
      label: shift.name,
    })),
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700">View:</span>
        {filterOptions.map((option) => {
          const isSelected = selectedFilter === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

