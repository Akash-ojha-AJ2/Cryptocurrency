import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import crosshairPlugin from "chartjs-plugin-crosshair";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { fetchInitialChartData, updateChartDataFromSocket } from "./FunctionsStore";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale,
  crosshairPlugin
);

const SOCKET_URL = "ws://localhost:5000";
const symbols = [
  { name: "BTC/USDT", symbol: "BTCUSDT" },
  { name: "ETH/USDT", symbol: "ETHUSDT" },
  { name: "SOL/USDT", symbol: "SOLUSDT" },
  { name: "ADA/USDT", symbol: "ADAUSDT" },
  { name: "XRP/USDT", symbol: "XRPUSDT" },
  { name: "DOGE/USDT", symbol: "DOGEUSDT" },
  { name: "DOT/USDT", symbol: "DOTUSDT" },
];

function CryptoHistoryChart({ symbol, name }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchInitialChartData(symbol, name, setChartData);

    const ws = new WebSocket(SOCKET_URL);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateChartDataFromSocket(data, symbol, setChartData);
    };
    ws.onerror = (err) => console.error("WebSocket error:", err);
    return () => ws.close();
  }, [symbol, name]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "nearest", intersect: false },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          stepSize: 15,
          tooltipFormat: "MMM d, h:mm a",
          displayFormats: { minute: "h:mm a" },
        },
        grid: { color: "#f0f0f0" },
        ticks: {
          source: "auto",
          autoSkip: true,
          maxTicksLimit: 8,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        title: { display: true, text: "Price (USDT)" },
        grid: { color: "#f0f0f0" },
        ticks: { maxTicksLimit: 10 },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => `Price: $${ctx.parsed.y.toFixed(2)}`,
        },
      },
      crosshair: {
        line: { color: "#888", width: 1 },
        snap: { enabled: false },
        interpolate: true,
      },
    },
    elements: {
      point: { radius: 0, hitRadius: 10, hoverRadius: 0 },
    },
  };

  return (
    <div className="card shadow mb-4 w-100">
      <div className="card-body">
        <h5 className="card-title text-center">📈 {name} - Live Price</h5>
        <div style={{ height: "400px" }}>
          {chartData ? <Line data={chartData} options={options} /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}

function BinanceLiveChart() {
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);

  return (
    <div className="container-fluid mt-5 pt-5">
      <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
        {symbols.map((coin) => (
          <button
            key={coin.symbol}
            className={`btn ${selectedSymbol.symbol === coin.symbol ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedSymbol(coin)}
          >
            {coin.name}
          </button>
        ))}
      </div>
      <CryptoHistoryChart symbol={selectedSymbol.symbol} name={selectedSymbol.name} />
    </div>
  );
}

export default BinanceLiveChart;
