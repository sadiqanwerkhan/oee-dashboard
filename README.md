# Production Line OEE Dashboard

A high-performance React/TypeScript dashboard for visualizing Overall Equipment Effectiveness (OEE) metrics, designed to help production managers identify operational inefficiencies and optimize manufacturing performance.

## Features

### Core Features
- **OEE Calculations**: Calculate OEE and its components (Availability, Performance, Quality) for individual shifts and full day
- **Color-Coded Dashboard**: Visual status indicators (Green ≥85%, Yellow 65-85%, Red <65%)
- **Component Breakdown**: Detailed visualization of Availability, Performance, and Quality metrics
- **Period Comparison**: Compare current metrics with previous period with delta indicators
- **Top Downtime Reasons**: Identify top 3 downtime events with duration tracking

### Extended Features
- **Shift Filtering**: Toggle between "All Shifts" and individual shift views
- **Trend Indicators**: Visual trend arrows (↑↓) showing week-over-week changes
- **Pareto Analysis**: Visual breakdown of downtime categories by total duration
- **Mini Chart**: Bar chart visualization comparing OEE across shifts
- **Export Functionality**: Download dashboard data as JSON or CSV

## Tech Stack

- **React 19** - UI library with hooks and functional components
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **ESLint** - Code linting and quality assurance

## Setup Instructions

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sadiqanwerkhan/oee-dashboard
cd oee-dashboard
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode
```bash
npm run dev
```
The application will start on `http://localhost:5173` (or the next available port).

#### Build for Production
```bash
npm run build
```
The production build will be created in the `dist` directory.

#### Preview Production Build
```bash
npm run preview
```

#### Linting
```bash
npm run lint
```

#### Testing
```bash
npm test
```

Run tests in watch mode or with UI:
```bash
npm run test:ui
```

## Architecture Decisions

### 1. Separation of Concerns

The codebase is organized into clear layers:

- **Components**: Pure UI components that only handle rendering. All components use `React.memo` to prevent unnecessary re-renders.
- **Hooks**: Custom hooks contain all business logic and data processing. Calculations are memoized with `useMemo` for performance.
- **Utils**: Pure functions for calculations (OEE formulas, data transformations). These are easy to test and reuse.
- **Types**: Centralized TypeScript definitions for type safety across the app.

### 2. Performance Optimizations

Several techniques are used to keep the app fast:

- **React.memo**: Wraps all components to skip re-renders when props don't change
- **useMemo**: Memoizes expensive calculations like filtering, sorting, and formatting
- **useCallback**: Memoizes event handlers to maintain stable references
- **Data Structures**: Uses Map/Set for O(1) lookups instead of O(n) array searches
- **Static Configs**: Moves configuration objects outside components to avoid recreating them

### 3. Custom Hooks Pattern

Business logic lives in custom hooks (`useOEE`, `useDowntime`, etc.) which:
- Keep components clean and focused on UI
- Make logic reusable across different components
- Handle memoization automatically
- Are easy to test independently

### 4. Component Composition

Small, single-purpose components that work together:
- Each component does one thing well
- Easy to test and maintain
- Can be reused in different contexts

### 5. TypeScript for Safety

- Catches errors at compile time
- Provides better IDE autocomplete
- Makes code self-documenting through types
- Ensures consistency across the codebase

## OEE Calculation Formulas

The application follows Lean Manufacturing standards:

- **Availability** = Operating Time / Planned Production Time
  - Operating Time = Planned Production Time - Downtime

- **Performance** = Actual Quantity / Ideal Quantity
  - Ideal Quantity = Operating Time / Target Cycle Time

- **Quality** = Good Quantity / Actual Quantity

- **OEE** = Availability × Performance × Quality

All calculations are pure functions in `src/utils/oeeCalculations.ts`.

## Assumptions

1. **Data Format**: Production data comes as JSON with shifts, downtime events, and metadata. The structure matches `src/data/production-data.json`.

2. **Time Units**: Planned time and downtime are in minutes, cycle time is in seconds. The app handles conversions internally.

3. **OEE Thresholds**: Default thresholds are 85% (World-Class) and 65% (Minimum Acceptable), but these can be changed via metadata.

4. **Browser Support**: Modern browsers only (Chrome, Firefox, Safari, Edge). No support for older browsers.

5. **Single Production Line**: Current implementation handles one production line at a time.

## Project Structure

```
src/
├── components/          # React components (all memoized)
│   ├── OEEDisplay.tsx           # Main OEE metric display
│   ├── ComponentBreakdown.tsx   # A/P/Q breakdown
│   ├── PeriodComparison.tsx     # Period comparison
│   ├── TopDowntimeReasons.tsx   # Top downtime events
│   ├── ShiftFilter.tsx          # Shift filter toggle
│   ├── TrendIndicator.tsx       # Trend visualization
│   ├── ParetoChart.tsx          # Pareto analysis
│   ├── MiniChart.tsx            # Shift comparison chart
│   ├── ExportButton.tsx         # Export functionality
│   └── index.ts                 # Component exports
├── hooks/              # Custom React hooks
│   ├── useOEE.ts               # OEE calculation hooks
│   ├── useDowntime.ts          # Downtime processing hooks
│   ├── usePeriodComparison.ts  # Period comparison hook
│   ├── useProductionData.ts     # Data loading hook
│   └── index.ts                # Hook exports
├── utils/              # Utility functions
│   ├── oeeCalculations.ts      # OEE calculation logic
│   ├── downtimeUtils.ts        # Downtime processing
│   ├── exportUtils.ts          # Export functionality
│   └── index.ts                # Utility exports
├── types/              # TypeScript type definitions
│   └── index.ts
├── data/               # Static data
│   └── production-data.json
├── test/               # Test setup
│   └── setup.ts
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Testing

The project includes unit tests demonstrating testing best practices:

- **Utility Function Tests** (`src/utils/oeeCalculations.test.ts`): Comprehensive tests for OEE calculation functions including edge cases, boundary conditions, and data validation
- **Hook Tests** (`src/hooks/useOEE.test.tsx`): Tests for custom React hooks using React Testing Library, including memoization behavior verification

Run tests with:
```bash
npm test
```

## Future Enhancements

- **State Management**: Integrate React Query for server state management, caching, and background updates. Use `useReducer` for complex local state that involves multiple sub-values.

- **Real-time Updates**: WebSocket integration for live data updates without page refresh

- **Historical Analysis**: Time-series charts showing OEE trends over days, weeks, or months

- **Multi-line Support**: Extend to handle multiple production lines simultaneously

- **Advanced Filtering**: Filter downtime events by category, type, date range, or shift

- **Data Caching**: Implement caching strategies for large datasets using React Query's built-in cache management

- **Performance Monitoring**: Add performance metrics and monitoring for large-scale deployments

- **Print Reports**: Generate PDF reports with all dashboard metrics

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the established architecture patterns
3. Ensure all linting passes (`npm run lint`)
4. Run tests to ensure nothing breaks (`npm test`)
5. Test your changes thoroughly
6. Submit a pull request

## License

This project is private and proprietary.
