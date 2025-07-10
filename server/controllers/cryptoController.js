const axios = require('axios');

// ✅ Fetch real-time price
const History = async (req, res) => {
  const symbol = req.params.symbol;

  try {
    // First request: latest 1000
    const url1 = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=1000`;
    const response1 = await axios.get(url1);

    // Second request: 440 candles before 1000
    const oldestTime = response1.data[0][0] - (440 * 60 * 1000); // Go 440 min back
    const url2 = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=440&endTime=${response1.data[0][0] - 1}`;
    const response2 = await axios.get(url2);

    const merged = [...response2.data, ...response1.data];

    const formatted = merged.map((d) => ({
      time: d[0],
      close: parseFloat(d[4]),
    }));

    res.json({ history: formatted });
  } catch (err) {
    console.error("Error fetching Binance data:", err.message);
    res.status(500).json({ error: "Failed to fetch Binance history" });
  }
};


// ✅ Fetch last 24h price data
const fetch24HourHistory = async (req, res) => {
  const symbol = req.params.symbol;
  console.log("Symbol received:", symbol); // ✅ Debug line

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=300`;

  try {
    const response = await axios.get(url);
    const formatted = response.data.map(d => ({
      time: d[0],
      close: parseFloat(d[4])
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
};


const symbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "ADAUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "DOTUSDT"
];


// ✅ Get all latest prices for dashboard
const getAllLatestPrices = async (req, res) => {
  try {
    const prices = await Promise.all(
      symbols.map(async (symbol) => {
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
    return {
          symbol,
          price: parseFloat(response.data.lastPrice),
          change: parseFloat(response.data.priceChangePercent),
          volume: parseFloat(response.data.quoteVolume)
        };
      })
    );
    res.status(200).json(prices);
  } catch (err) {
    console.error("❌ Error fetching prices:", err.message);
    res.status(500).json({ error: "Failed to fetch crypto prices" });
  }
};

module.exports = {
  History,
  fetch24HourHistory,
  getAllLatestPrices
};
