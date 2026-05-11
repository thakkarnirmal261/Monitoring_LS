import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { fetchMetrics } from './api.js';
import './app.css';

export default function App() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchMetrics();

        const formatted = data.map((m) => ({
          ...m,
          ram: Number(m.ram) || 0,
          load: Number(m.load) || 0,
          disk_used_percent: Number(m.disk_used_percent) || 0,
          load1: Number(m.load1) || 0,
          load5: Number(m.load5) || 0,
          load15: Number(m.load15) || 0,
          cpu_percent: Number(m.cpu_percent) || 0,
          time: new Date(m.time).toLocaleTimeString(),
        }));

        setMetrics(formatted);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        console.error('Metrics fetch error:', err);
        if (metrics.length === 0) {
          setError('Failed to fetch metrics. Make sure backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();

    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const latest = metrics[metrics.length - 1] || {};

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

  const ChartBox = ({ title, children }) => (
    <div className="chart-container">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="container">
      <header className="header">
        <h1>📊 Server Monitoring Dashboard</h1>
        <p>RAM, Disk, CPU and Load Metrics Over Time</p>
      </header>

      {loading && metrics.length === 0 ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading metrics...</p>
        </div>
      ) : (
        <>
          <div className="last-updated">
            Last updated: {lastUpdated || 'Never'}
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>🧠 RAM Used</h3>
              <p className="stat-value">{latest.ram ?? 0}</p>
              <p className="stat-label">MB</p>
            </div>

            <div className="stat-card">
              <h3>💽 Disk Used</h3>
              <p className="stat-value">{latest.disk_used_percent ?? 0}%</p>
              <p className="stat-label">Root disk usage</p>
            </div>

            <div className="stat-card">
              <h3>🔥 CPU Used</h3>
              <p className="stat-value">{latest.cpu_percent ?? 0}%</p>
              <p className="stat-label">Processor usage</p>
            </div>

            <div className="stat-card">
              <h3>⚡ Load 1 Min</h3>
              <p className="stat-value">{latest.load1 ?? 0}</p>
              <p className="stat-label">Current load</p>
            </div>

            <div className="stat-card">
              <h3>⚙️ Load 5 Min</h3>
              <p className="stat-value">{latest.load5 ?? 0}</p>
              <p className="stat-label">Medium average</p>
            </div>

            <div className="stat-card">
              <h3>📈 Load 15 Min</h3>
              <p className="stat-value">{latest.load15 ?? 0}</p>
              <p className="stat-label">Long average</p>
            </div>
          </div>

          {metrics.length > 0 && (
            <>
              <div className="charts-grid">
                <ChartBox title="RAM Usage Over Time">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ram" dot={false} name="RAM Used MB" />
                  </LineChart>
                </ChartBox>

                <ChartBox title="CPU Usage Over Time">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cpu_percent" dot={false} name="CPU %" />
                  </LineChart>
                </ChartBox>

                <ChartBox title="Disk Usage Over Time">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="disk_used_percent" dot={false} name="Disk %" />
                  </LineChart>
                </ChartBox>

                <ChartBox title="Load Average Over Time">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="load1" dot={false} name="Load 1 min" />
                    <Line type="monotone" dataKey="load5" dot={false} name="Load 5 min" />
                    <Line type="monotone" dataKey="load15" dot={false} name="Load 15 min" />
                  </LineChart>
                </ChartBox>
              </div>

              <div className="table-container">
                <h2>Recent Metrics Data</h2>
                <table className="metrics-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>RAM MB</th>
                      <th>CPU %</th>
                      <th>Disk %</th>
                      <th>Load 1</th>
                      <th>Load 5</th>
                      <th>Load 15</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...metrics].reverse().map((metric, index) => (
                      <tr key={index}>
                        <td>{metrics.length - index}</td>
                        <td>{metric.ram}</td>
                        <td>{metric.cpu_percent}%</td>
                        <td>{metric.disk_used_percent}%</td>
                        <td>{metric.load1}</td>
                        <td>{metric.load5}</td>
                        <td>{metric.load15}</td>
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