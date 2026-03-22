import next from "next";
import http from "http";

const port = process.env.PORT || 8080;
const dev = false;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`> Server ready on http://0.0.0.0:${port}`);
  });
});
