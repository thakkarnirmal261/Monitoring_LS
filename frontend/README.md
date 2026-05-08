# 📊 Server Monitoring Dashboard - Frontend

A modern React-based monitoring dashboard that displays real-time metrics from the production monitoring server.

## Features

- **Real-time Data Display**: Fetches metrics every 5 seconds from the monitoring server
- **Statistics Cards**: Shows current, average, and peak values for RAM and system load
- **Interactive Charts**: Visual representation of RAM usage and system load over time using Recharts
- **Data Table**: Displays recent metrics records in a structured table format
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error messages when the server is unavailable

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn installed
- Monitoring server running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env
```

### Development

Start the development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

**Note**: The Vite dev server includes a proxy that forwards `/metrics` and `/trigger` requests to `http://localhost:8000`

### Production Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How It Works

1. **API Layer** (`src/api.js`):
   - Uses Axios to communicate with the monitoring server
   - Provides `fetchMetrics()` function to retrieve data from `/metrics` endpoint
   - Provides `triggerMetrics()` function to manually trigger data collection

2. **Main Component** (`src/app.jsx`):
   - Fetches metrics on component mount
   - Sets up auto-refresh polling every 5 seconds
   - Calculates statistics (average, max, current values)
   - Displays data in multiple formats: cards, charts, and table

3. **Styling** (`src/app.css`):
   - Modern gradient design with purple theme
   - Responsive grid layouts
   - Smooth animations and transitions
   - Mobile-friendly breakpoints

## Data Structure

The monitoring server's `/metrics` endpoint returns an array of objects:

```json
[
  {
    "ram": "45.2",
    "load": "1.23",
    "time": "2024-01-15 10:30:45"
  },
  {
    "ram": "48.5",
    "load": "1.45",
    "time": "2024-01-15 10:30:50"
  }
]
```

## Configuration

### Changing the API URL

**Development**: Edit `vite.config.js` to modify the proxy target
**Production**: Set the `VITE_API_URL` environment variable before building

```bash
VITE_API_URL=https://your-production-server.com npm run build
```

### Auto-refresh Interval

To change the polling interval (currently 5 seconds), edit `src/app.jsx`:

```javascript
const interval = setInterval(loadMetrics, 5000); // Change 5000 to desired milliseconds
```

## Dependencies

- **React 19.0.0**: UI framework
- **Vite 6.3.5**: Build tool and dev server
- **Axios 1.8.4**: HTTP client
- **Recharts 2.15.1**: Chart library
- **@vitejs/plugin-react 4.3.4**: Vite React plugin

## Troubleshooting

### "Failed to fetch metrics" Error

- Ensure the monitoring server is running on the configured URL
- Check browser console for CORS errors
- Verify the backend `/metrics` endpoint is accessible

### Charts not showing

- Ensure metrics data is being fetched (check Network tab in DevTools)
- Verify the backend is returning data in the correct format

### Styling issues

- Clear browser cache (Ctrl+Shift+Del)
- Restart the dev server
- Check if CSS file (`app.css`) is properly loaded

## Project Structure

```
frontend/
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration with proxy
├── package.json        # Dependencies
├── .env.example        # Environment template
└── src/
    ├── main.jsx        # React entry point
    ├── app.jsx         # Main dashboard component
    ├── app.css         # Styling
    └── api.js          # API utilities
```

## License

This is part of the Monitoring_LS project.
