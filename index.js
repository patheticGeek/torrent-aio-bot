const next = require("next");
const express = require("express");
const compression = require("compression");
const WebTorrent = require("webtorrent");

const prettyBytes = require("./lib/prettyBytes");
const humanTime = require("./lib/humanTime");

const dev = process.env.NODE_ENV !== "production";
const server = express();
const app = next({ dev, dir: "web" });
const handle = app.getRequestHandler();
const torrentClient = new WebTorrent({});
const PORT = parseInt(process.env.PORT, 10) || 3000;

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

  server.get("/ping", (req, res) => {
    res.send("pong");
  });

  server.get("/api/v1/torrent/download", (req, res) => {
    const link = req.query.link;
    if (!link) {
      res.send({ error: true, errorMessage: "No magnet link provided" });
    } else {
      torrentClient.add(link);
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
    let status = null;
    if (torrentClient.get(link)) status = statusLoader(torrentClient.get(link));
    res.send({ error: false, link, status });
  });

  server.get("/api/v1/torrent/list", (req, res) => {
    const list = torrentClient.torrents.map(torrent => statusLoader(torrent));
    res.send({ error: false, list });
  });

  server.all("*", (req, res) => {
    handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`> Running on http://localhost:${PORT}`);
  });
})();
