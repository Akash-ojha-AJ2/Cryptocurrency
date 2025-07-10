import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  SOCKET_URL,
  cryptoList,
  initializeFavorites,
  toggleFavoriteCoin,
  fetchCryptoNews,
  generatePDFReport
} from './FunctionsStore';

function Dashboard() {
  const [cryptoData, setCryptoData] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [news, setNews] = useState([]);
  const [favorites, setFavorites] = useState(initializeFavorites());

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCryptoData((prev) => ({
        ...prev,
        [data.symbol]: {
          usd: data.price,
          usd_24h_change: data.change || 0,
          usd_24h_vol: data.volume || 0
        }
      }));
      setLastUpdated(new Date().toLocaleTimeString());
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
    };

    fetchCryptoNews(setNews);
    return () => ws.close();
  }, []);

  const handleFavorite = (id) => {
    const updated = toggleFavoriteCoin(id, favorites);
    setFavorites(updated);
  };

  const handleDownload = async () => {
    const reportData = cryptoList.map((coin) => {
      const data = cryptoData[coin.symbol] || {};
      return {
        name: coin.name,
        price: parseFloat(data.usd || 0).toFixed(2),
        change: parseFloat(data.usd_24h_change || 0).toFixed(2),
        volume: parseFloat(data.usd_24h_vol || 0).toFixed(2)
      };
    });

    const success = await generatePDFReport(reportData);
    if (success) alert('✅ File successfully downloaded and saved!');
  };

  return (
    <div className="container-fluid bg-light py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold">📊 CryptoPulse Dashboard</h2>
        <p className="text-muted">Live crypto intelligence center (updates via WebSocket)</p>
      </div>

      <div className="row g-3 mb-4">
        {cryptoList.slice(0, 3).map((coin) => {
          const data = cryptoData[coin.symbol] || {};
          return (
            <div className="col-md-4" key={coin.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{coin.name}</h5>
                  <p className="card-text fs-5">${parseFloat(data.usd || 0).toFixed(2)}</p>
                  <span className={data.usd_24h_change >= 0 ? 'text-success' : 'text-danger'}>
                    {parseFloat(data.usd_24h_change || 0).toFixed(2)}% (24h)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">⏱ Last Updated</h5>
              <p className="card-text fs-5">{lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">📈 Top Movers (24h)</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Coin</th>
                  <th>Price</th>
                  <th>Change (24h)</th>
                  <th>Volume</th>
                  <th className="text-center">Favorite</th>
                </tr>
              </thead>
              <tbody>
                {cryptoList.map((coin) => {
                  const data = cryptoData[coin.symbol] || {};
                  return (
                    <tr key={coin.id}>
                      <td>{coin.name}</td>
                      <td>${parseFloat(data.usd || 0).toFixed(2)}</td>
                      <td className={data.usd_24h_change >= 0 ? 'text-success' : 'text-danger'}>
                        {parseFloat(data.usd_24h_change || 0).toFixed(2)}%
                      </td>
                      <td>${parseFloat(data.usd_24h_vol || 0).toFixed(2)}</td>
                      <td
                        style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                        className="text-center"
                        onClick={() => handleFavorite(coin.id)}
                      >
                        {favorites.includes(coin.id) ? '★' : '☆'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">📥 Download Monthly Report</h5>
          <button className="btn btn-primary" onClick={handleDownload}>
            Download PDF
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">📰 Crypto News</h5>
          <ul className="list-group list-group-flush">
            {news.map((item, index) => (
              <li key={index} className="list-group-item">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
