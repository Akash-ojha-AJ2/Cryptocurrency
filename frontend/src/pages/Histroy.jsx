import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
import { fetch24hHistoryData } from "./FunctionsStore";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale
);

const symbols = [
  { name: "BTC/USDT", symbol: "BTCUSDT" },
  { name: "ETH/USDT", symbol: "ETHUSDT" },
  { name: "SOL/USDT", symbol: "SOLUSDT" },
  { name: "ADA/USDT", symbol: "ADAUSDT" },
  { name: "XRP/USDT", symbol: "XRPUSDT" },
  { name: "DOGE/USDT", symbol: "DOGEUSDT" },
  { name: "DOT/USDT", symbol: "DOTUSDT" },
];

function CryptoHistoryViewer() {
  const [selected, setSelected] = useState(symbols[0]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch24hHistoryData(selected.symbol, selected.name, setChartData);
  }, [selected]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "MMM d, ha",
        },
        title: { display: true, text: "Time" },
        grid: { color: "#f0f0f0" },
      },
      y: {
        title: { display: true, text: "Price (USDT)" },
        grid: { color: "#f0f0f0" },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="container-fluid mt-5">
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {symbols.map((coin) => (
          <button
            key={coin.symbol}
            className={`btn btn-sm ${
              selected.symbol === coin.symbol ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setSelected(coin)}
          >
            {coin.name}
          </button>
        ))}
      </div>

      <div className="card shadow">
        <div className="card-body">
          <h5 className="text-center">📊 {selected.name} - Stored Chart (24h)</h5>
          <div style={{ height: "400px" }}>
            {chartData ? (
              <Line data={chartData} options={options} />
            ) : (
              <p className="text-center">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoHistoryViewer;
