import { createServer } from 'http';
import next from 'next';

const port = process.env.PORT || 8080;
const hostname = '0.0.0.0';
const dev = false;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

function logRequest(req, res) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`);
  });
}

function logError(err, req, res) {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);
  if (res && !res.headersSent) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
  }
}

process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] uncaughtException:`, err);
});
process.on('unhandledRejection', (reason) => {
  console.error(`[${new Date().toISOString()}] unhandledRejection:`, reason);
});
process.on('exit', (code) => {
  console.log(`[${new Date().toISOString()}] process exit: code ${code}`);
});
process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] SIGTERM received, shutting down.`);
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log(`[${new Date().toISOString()}] SIGINT received, shutting down.`);
  process.exit(0);
});

app.prepare().then(() => {
  createServer(async (req, res) => {
    logRequest(req, res);
    try {
      await handle(req, res);
    } catch (err) {
      logError(err, req, res);
    }
  }).listen(port, hostname, () => {
    console.log(`[${new Date().toISOString()}] Server started on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error(`[${new Date().toISOString()}] Failed to start server:`, err);
  process.exit(1);
});