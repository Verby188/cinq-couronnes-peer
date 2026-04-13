const { PeerServer } = require('peer');
const http = require('http');
const https = require('https');

const port = process.env.PORT || 9000;

// "origin: true" accepts all origins including null (file:// WebView)
const server = PeerServer({
  port: port,
  path: '/peerjs',
  allow_discovery: false,
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: false
  }
});

server.on('connection', client => {
  console.log('Connected:', client.getId());
});
server.on('disconnect', client => {
  console.log('Disconnected:', client.getId());
});

console.log('PeerJS server on port', port);

// Keep-alive ping every 14 min so Render free tier stays awake
const SELF = process.env.RENDER_EXTERNAL_URL;
if (SELF) {
  setInterval(() => {
    https.get(SELF + '/peerjs', res => {
      console.log('Keep-alive:', res.statusCode);
    }).on('error', () => {});
  }, 14 * 60 * 1000);
}
