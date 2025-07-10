const express = require('express');
const router = express.Router();
const controller = require('../controllers/cryptoController');

router.get('/price/:symbol', async (req, res) => {
  const result = await controller.fetchLatestPrice(req.params.symbol);
  if (result) return res.json(result);
  res.status(500).json({ error: 'Failed to fetch price' });
});

router.get('/price', controller.getAllLatestPrices);

router.get('/live/:symbol',controller.fetch24HourHistory);
router.get("/history/:symbol", controller.History);

module.exports = router;