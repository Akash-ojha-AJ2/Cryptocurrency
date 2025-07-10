const WebSocket = require('ws');
const axios = require('axios');

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "ADAUSDT", "XRPUSDT", "DOGEUSDT", "DOTUSDT"];

function fetchPrice(symbol) {
  return axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
    .then((res) => ({
      symbol,
      price: parseFloat(res.data.lastPrice),
      change: parseFloat(res.data.priceChangePercent),
      volume: parseFloat(res.data.quoteVolume),
      time: new Date()
    }))
    .catch((err) => {
      console.error(`Error fetching ${symbol}:`, err.message);
      return null;
    });
}

let clients = [];

module.exports = function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    clients.push(ws);
    console.log("✅ Client connected to WebSocket");

    ws.on('close', () => {
      clients = clients.filter(c => c !== ws);
      console.log("❌ Client disconnected");
    });
  });

  setInterval(async () => {
    for (let symbol of symbols) {
      const data = await fetchPrice(symbol);
      if (data) {
        clients.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
          }
        });
      }
    }
  }, 1000); // every 5 seconds
};
