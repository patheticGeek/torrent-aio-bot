const express = require("express");
const next = require("next");
const compression = require("compression");
const bodyParser = require("body-parser");

const humanTime = require("./utils/humanTime");
const keepalive = require("./utils/keepalive");
const diskinfo = require("./utils/diskinfo");
const status = require("./utils/status");

const search = require("./routes/search");
const details = require("./routes/details");
const torrent = require("./routes/torrent");

const dev = process.env.NODE_ENV !== "production";
const PORT = parseInt(process.env.PORT, 10) || 3000;

const server = express();
const app = next({ dev, dir: "web" });
const handle = app.getRequestHandler();

keepalive();

(async () => {
  await app.prepare();

  server.use(compression());
  server.use(bodyParser.json());

  server.use("/api/v1/downloads", express.static("downloads"));

  server.use("/api/v1/torrent", torrent);

  server.use("/api/v1/search", search);

  server.use("/api/v1/details", details);

  server.get("/ping", (req, res) => {
    res.send("pong");
  });

  server.get("/api/v1/uptime", async (req, res) => {
    res.send({ uptime: humanTime(process.uptime() * 1000) });
  });

  server.get("/api/v1/diskinfo", async (req, res) => {
    const path = req.query.path;
    const info = await diskinfo(path);
    res.send(info);
  });

  server.get("/api/v1/status", async (req, res) => {
    const currStatus = await status();
    res.send(currStatus);
  });

  server.all("*", (req, res) => {
    handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`> Running on http://localhost:${PORT}`);
  });
})();
