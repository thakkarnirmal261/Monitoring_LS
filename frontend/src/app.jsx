import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchMetrics } from './api.js';
import './app.css';

export default function App() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch metrics on component mount and set up polling
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchMetrics();
        setMetrics(data);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Metrics fetch error:', err);
        // Only set error if this is the first load and we have no data
        if (metrics.length === 0) {
          setError('Failed to fetch metrics. Make sure the monitoring server is running.');
        }
        setLoading(false);
      }
    };

    loadMetrics();

    // Poll for new data every 5 seconds
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate summary statistics
  const stats = React.useMemo(() => {
    if (metrics.length === 0) return { avgRam: 0, avgLoad: 0, maxRam: 0, maxLoad: 0 };

    const rams = metrics.map(m => parseFloat(m.ram) || 0);
    const loads = metrics.map(m => parseFloat(m.load) || 0);

    return {
      avgRam: (rams.reduce((a, b) => a + b, 0) / rams.length).toFixed(2),
      avgLoad: (loads.reduce((a, b) => a + b, 0) / loads.length).toFixed(2),
      maxRam: Math.max(...rams).toFixed(2),
      maxLoad: Math.max(...loads).toFixed(2),
      latestRam: rams[rams.length - 1]?.toFixed(2),
      latestLoad: loads[loads.length - 1]?.toFixed(2),
    };
  }, [metrics]);

  if (error) {
    return (
      <div className="container error-container">
        <div className="error-box">
          <h1>❌ Error</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>📊 Server Monitoring Dashboard</h1>
        <p>Production Server Metrics</p>
      </header>

      {loading && metrics.length === 0 ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading metrics...</p>
        </div>
      ) : (
        <>
          {/* Last Updated */}
          <div className="last-updated">
            Last updated: {lastUpdated || 'Never'}
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>📈 Current RAM</h3>
              <p className="stat-value">{stats.latestRam}%</p>
              <p className="stat-label">Last recorded</p>
            </div>
            <div className="stat-card">
              <h3>⚡ Current Load</h3>
              <p className="stat-value">{stats.latestLoad}</p>
              <p className="stat-label">Last recorded</p>
            </div>
            <div className="stat-card">
              <h3>📊 Avg RAM</h3>
              <p className="stat-value">{stats.avgRam}%</p>
              <p className="stat-label">Average</p>
            </div>
            <div className="stat-card">
              <h3>⚙️ Avg Load</h3>
              <p className="stat-value">{stats.avgLoad}</p>
              <p className="stat-label">Average</p>
            </div>
            <div className="stat-card">
              <h3>📈 Peak RAM</h3>
              <p className="stat-value">{stats.maxRam}%</p>
              <p className="stat-label">Maximum</p>
            </div>
            <div className="stat-card">
              <h3>⚡ Peak Load</h3>
              <p className="stat-value">{stats.maxLoad}</p>
              <p className="stat-label">Maximum</p>
            </div>
          </div>

          {/* Charts */}
          {metrics.length > 0 && (
            <>
              <div className="charts-grid">
                <div className="chart-container">
                  <h2>RAM Usage Over Time</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis label={{ value: 'RAM (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => `${value}%`}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="ram" 
                        stroke="#667eea" 
                        dot={false}
                        isAnimationActive={false}
                        name="RAM Usage"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h2>System Load Over Time</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis label={{ value: 'Load', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="load" 
                        stroke="#764ba2" 
                        dot={false}
                        isAnimationActive={false}
                        name="System Load"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Table */}
              <div className="table-container">
                <h2>Recent Metrics Data</h2>
                <table className="metrics-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>RAM Usage (%)</th>
                      <th>System Load</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...metrics].reverse().map((metric, index) => (
                      <tr key={index}>
                        <td>{metrics.length - index}</td>
                        <td>
                          <span className="ram-badge">
                            {metric.ram}%
                          </span>
                        </td>
                        <td>
                          <span className="load-badge">
                            {metric.load}
                          </span>
                        </td>
                        <td>{metric.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="table-info">Showing {metrics.length} most recent records</p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
