const http = require('http');
const app = require('./app');
const setupWebSocket = require('./websocket/socket');
const connectToDatabase = require('./DB/db');

const server = http.createServer(app); // ✅ Create server
setupWebSocket(server); // ✅ Setup WebSocket on that server

const PORT = 5000;

// ✅ Connect to DB and start the server
connectToDatabase().then(() => {
  server.listen(PORT, () => {  // ✅ Start custom server, not app.listen
    console.log('🚀 Server running with WebSocket on http://localhost:5000');
  });
});
