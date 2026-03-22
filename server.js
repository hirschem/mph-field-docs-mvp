import { createServer } from "http";

const port = process.env.PORT || 8080;
const hostname = "0.0.0.0";

const server = createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }

  if (req.url === "/" || req.url?.startsWith("/?")) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("plain node ok");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("not found");
});

server.listen(port, hostname, () => {
  console.log(`[${new Date().toISOString()}] Plain server started on http://${hostname}:${port}`);
});