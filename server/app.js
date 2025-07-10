const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const cryptoRoutes = require('./routes/cryptoRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use('/api', cryptoRoutes);
app.use('/api', reportRoutes);

module.exports = app;
