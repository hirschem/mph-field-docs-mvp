import next from "next";
import http from "http";

const port = process.env.PORT || 8080;
const dev = false;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer(async (req, res) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    try {
      await handle(req, res);
      console.log(`[RES] ${req.method} ${req.url} -> ${res.statusCode}`);
    } catch (err) {
      console.error(`[ERR] ${req.method} ${req.url}`, err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`> Server ready on http://0.0.0.0:${port}`);
  });
});