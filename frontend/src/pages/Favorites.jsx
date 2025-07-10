import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SOCKET_URL = "ws://localhost:5000";

// ✅ Map CoinGecko IDs to Binance Symbols
const symbolMap = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  solana: 'SOLUSDT',
  cardano: 'ADAUSDT',
  ripple: 'XRPUSDT',
  dogecoin: 'DOGEUSDT',
  polkadot: 'DOTUSDT',
};

function FavoritePage() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [cryptoData, setCryptoData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setLoading(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // ✅ Match WebSocket data with favorite symbols
      const matched = favorites.find(id => symbolMap[id] === data.symbol);
      if (!matched) return;

      setCryptoData((prev) => ({
        ...prev,
        [matched]: {
          price: data.price,
          change: data.change,
          volume: data.volume,
        },
      }));
    };

    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.log("🔌 WebSocket disconnected");

    return () => ws.close();
  }, [favorites]);

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">⭐ Favorite Cryptocurrencies</h2>
        <a href="/" className="btn btn-outline-secondary">← Back to Dashboard</a>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Connecting to WebSocket...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="alert alert-warning text-center">
          You have not added any favorites yet. Go to Dashboard and click the star (⭐) icon.
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((id) => {
            const data = cryptoData[id] || {};
            const price = data.price?.toFixed(2) || 'N/A';
            const change = data.change?.toFixed(2) || '0.00';
            const changeClass = parseFloat(change) >= 0 ? 'text-success' : 'text-danger';

            return (
              <div className="col-md-4" key={id}>
                <div className="card shadow border-0 h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title text-uppercase fw-bold">{id}</h5>
                      <h3 className="text-dark">${price}</h3>
                      <p className={`mb-2 ${changeClass}`}>
                        {change}% (24h)
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">Live update</small>
                      <span className="text-warning fs-4">⭐</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FavoritePage;
