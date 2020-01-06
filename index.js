const express = require("express");
const next = require("next");
const compression = require("compression");
const WebTorrent = require("webtorrent");
require("./lib/bot");

const keepalive = require("./utils/keepalive");
const prettyBytes = require("./utils/prettyBytes");
const humanTime = require("./utils/humanTime");
const diskinfo = require("./utils/diskinfo");

const search = require("./routes/search");
const details = require("./routes/details");

const dev = process.env.NODE_ENV !== "production";
const PORT = parseInt(process.env.PORT, 10) || 3000;

const server = express();
const app = next({ dev, dir: "web" });
const handle = app.getRequestHandler();

const torrentClient = new WebTorrent();

keepalive();

const statusLoader = torrent => {
  return {
    magnetURI: torrent.magnetURI,
    name: torrent.name,
    speed: `${prettyBytes(torrent.downloadSpeed)}/s`,
    downloaded: prettyBytes(torrent.downloaded),
    total: prettyBytes(torrent.length),
    progress: parseInt(torrent.progress * 100),
    timeRemaining: parseInt(torrent.timeRemaining),
    redableTimeRemaining: humanTime(torrent.timeRemaining),
    done: torrent.done,
    files: torrent.files.map(file => ({
      name: file.name,
      downloaded: prettyBytes(file.downloaded),
      total: prettyBytes(file.length),
      progress: parseInt(file.progress * 100),
      done: file.done,
      path: file.path
    }))
  };
};

(async () => {
  await app.prepare();

  server.use(compression());

  server.use("/api/v1/search", search);

  server.use("/api/v1/details", details);

  server.get("/ping", (req, res) => {
    res.send("pong");
  });

  server.get("/api/v1/diskinfo", async (req, res) => {
    const path = req.query.path;
    const info = await diskinfo(path);
    res.send(info);
  });

  server.get("/api/v1/torrent/download", async (req, res) => {
    const link = req.query.link;
    const index = req.query.index;
    if (!link || !index) {
      res.send({ error: true, errorMessage: "No link and/or index provided" });
    } else {
      const torrent = torrentClient.get(link);
      if (torrent) {
        if (!torrent.files[index].done) {
          res.send({
            error: true,
            errorMessage: "It hasent finished downloading yet",
            link
          });
        } else {
        }
      } else {
        res.send({
          error: true,
          errorMessage: "No such torrent exists",
          link
        });
      }
    }
  });

  server.get("/api/v1/torrent/start", (req, res) => {
    const link = req.query.link;
    if (!link) {
      res.send({ error: true, errorMessage: "No link provided" });
    } else {
      if (!torrentClient.get(link)) {
        torrentClient.add(link);
      }
      res.send({ error: false, link });
    }
  });

  server.get("/api/v1/torrent/remove", (req, res) => {
    const link = req.query.link;
    if (!link) {
      res.send({ error: true, errorMessage: "No link provided" });
    } else {
      if (torrentClient.get(link)) {
        torrentClient.remove(link);
      }
      res.send({ error: false });
    }
  });

  server.get("/api/v1/torrent/status", (req, res) => {
    const link = req.query.link;
    let torrent = null;
    if (torrentClient.get(link)) {
      torrent = torrentClient.get(link);
      res.send({ error: false, link, status: statusLoader(torrent) });
    } else {
      res.send({ error: true, errorMessage: "No such torrent exists", link });
    }
  });

  server.get("/api/v1/torrent/list", (req, res) => {
    const torrents = torrentClient.torrents.map(torrent =>
      statusLoader(torrent)
    );
    res.send({
      error: false,
      totalDownloadSpeed: torrentClient.downloadSpeed,
      torrents
    });
  });

  server.all("*", (req, res) => {
    handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`> Running on http://localhost:${PORT}`);
  });
})();
