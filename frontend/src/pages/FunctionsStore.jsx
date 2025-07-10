//Dashboard

import axios from "axios";

// 🌐 Backend URL from .env
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// 🔗 WebSocket URL
// WebSocket URL from env
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


// 📃 All Crypto List
export const cryptoList = [
  { id: "bitcoin", name: "BTC", symbol: "BTCUSDT" },
  { id: "ethereum", name: "ETH", symbol: "ETHUSDT" },
  { id: "solana", name: "SOL", symbol: "SOLUSDT" },
  { id: "cardano", name: "ADA", symbol: "ADAUSDT" },
  { id: "ripple", name: "XRP", symbol: "XRPUSDT" },
  { id: "dogecoin", name: "DOGE", symbol: "DOGEUSDT" },
  { id: "polkadot", name: "DOT", symbol: "DOTUSDT" },
];

// ⭐ Initialize Favorites from LocalStorage
export function initializeFavorites() {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
}

// ❤️ Toggle Favorite Coin
export function toggleFavoriteCoin(id, currentFavorites, setFavorites) {
  const updated = currentFavorites.includes(id)
    ? currentFavorites.filter((f) => f !== id)
    : [...currentFavorites, id];
  setFavorites(updated);
  localStorage.setItem("favorites", JSON.stringify(updated));
}

// 📰 Fetch Crypto News
export async function fetchCryptoNews(setNews) {
  try {
    const res = await fetch(
      "https://newsdata.io/api/1/news?apikey=pub_8eb7e2090cab46b2a98b47ed4f87a9b3&q=cryptocurrency&language=en&category=business"
    );
    const data = await res.json();
    setNews(data.results.slice(0, 5));
  } catch (err) {
    console.error("Error fetching news:", err);
  }
}

// 📥 Generate PDF Report
export async function generatePDFReport(cryptoData, callback) {
  const reportData = cryptoList.map((coin) => {
    const data = cryptoData[coin.symbol] || {};
    return {
      name: coin.name,
      price: parseFloat(data.usd || 0).toFixed(2),
      change: parseFloat(data.usd_24h_change || 0).toFixed(2),
      volume: parseFloat(data.usd_24h_vol || 0).toFixed(2),
    };
  });

  try {
    const res = await fetch(`${BACKEND_URL}/api/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: reportData }),
    });

    const result = await res.json();
    if (result && callback) callback(result);
  } catch (err) {
    console.error("Download error:", err);
  }
}

//________________________________________________________________________________________________________________________________


//Live Chart

// 📈 Fetch Initial 2-Hour Chart Data (Live)
export const fetchInitialChartData = async (symbol, name, setChartData) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/live/${symbol}`);
    if (!Array.isArray(res.data)) return;

    const now = Date.now();
    const formatted = res.data
      .map((item) => ({ time: new Date(item.time), close: item.close }))
      .filter((item) => now - item.time.getTime() <= 2 * 60 * 60 * 1000); // Last 2 hrs

    setChartData({
      labels: formatted.map((pt) => pt.time),
      datasets: [
        {
          label: `${name} - Last 2 Hours`,
          data: formatted.map((pt) => pt.close),
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    });
  } catch (err) {
    console.error("Error fetching chart data:", err);
  }
};

// 🔁 Update Live Chart Data via WebSocket
export const updateChartDataFromSocket = (data, symbol, setChartData) => {
  if (data.symbol !== symbol) return;

  const newTime = new Date(data.time);
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;

  setChartData((prev) => {
    if (!prev) return prev;

    const newLabels = [...prev.labels, newTime].filter(
      (t) => t.getTime() >= cutoff
    );
    const newData = [...prev.datasets[0].data, data.price].slice(
      -newLabels.length
    );

    return {
      labels: newLabels,
      datasets: [
        {
          ...prev.datasets[0],
          data: newData,
        },
      ],
    };
  });
};

//__________________________________________________________________________________________________________________________________
// History

// 🕓 Fetch 24-Hour History Chart Data (Stored)
export const fetch24hHistoryData = async (symbol, name, setChartData) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/history/${symbol}`);

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const formatted = res.data.history
      .map((pt) => ({
        time: new Date(pt.time || pt.timestamp),
        close: pt.close || pt.price,
      }))
      .filter((pt) => pt.time >= last24h);

    console.log("🟢 Total data points received:", formatted.length);

    setChartData({
      labels: formatted.map((pt) => pt.time),
      datasets: [
        {
          label: `${name} - Last 24h`,
          data: formatted.map((pt) => pt.close),
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    });
  } catch (error) {
    console.error("Failed to load chart history", error);
  }
};
