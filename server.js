const { PeerServer } = require('peer');
const https = require('https');

const port = process.env.PORT || 9000;

const server = PeerServer({
  port: port,
  path: '/peerjs',
  allow_discovery: false,
  cors: { origin: '*' }
});

server.on('connection', client => {
  console.log('Client connected:', client.getId());
});

server.on('disconnect', client => {
  console.log('Client disconnected:', client.getId());
});

console.log('PeerJS server running on port', port);

// Keep-alive: ping self every 14 minutes to avoid Render spin-down
const SELF_URL = process.env.RENDER_EXTERNAL_URL;
if (SELF_URL) {
  setInterval(() => {
    https.get(SELF_URL + '/peerjs', res => {
      console.log('Keep-alive ping:', res.statusCode);
    }).on('error', () => {});
  }, 14 * 60 * 1000);
}
