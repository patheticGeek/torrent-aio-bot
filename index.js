const fs = require("fs");
const next = require("next");
const express = require("express");
const compression = require("compression");
const WebTorrent = require("webtorrent");

const prettyBytes = require("./lib/prettyBytes");
const humanTime = require("./lib/humanTime");
const piratebaySearch = require("./crawllers/piratebay/search");
const piratebayDetails = require("./crawllers/piratebay/details");
const o337xSearch = require("./crawllers/1337x/search");
const o337xDetails = require("./crawllers/1337x/details");
const limetorrentSearch = require("./crawllers/limetorrent/search");
const limetorrentDetails = require("./crawllers/limetorrent/details");

const dev = process.env.NODE_ENV !== "production";
const server = express();
const app = next({ dev, dir: "web" });
const handle = app.getRequestHandler();
const torrentClient = new WebTorrent({});
const PORT = parseInt(process.env.PORT, 10) || 3000;

let uploadStore = [];

function startUpload(torrent) {
  if (
    !(uploadStore.filter(obj => obj.magnetURI === torrent.magnetURI).lenght > 0)
  ) {
    console.log("uploading: " + torrent.name);
    uploadStore.push({ status: "starting upload", ...torrent });
  }
}

const statusLoader = torrent => {
  if (torrent.done) {
    startUpload({
      path: torrent.path,
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
        path: file.path,
        downloaded: prettyBytes(file.downloaded),
        total: prettyBytes(file.length),
        progress: parseInt(file.progress * 100),
        done: file.done,
        path: file.path
      }))
    });
  }

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

  server.get("/api/v1/torrent/start", (req, res) => {
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
    let torrent = null;
    if (torrentClient.get(link))
      torrent = statusLoader(torrentClient.get(link));
    res.send({ error: false, link, torrent });
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

  server.get("/api/v1/torrent/uploading", (req, res) => {
    res.send({ error: false, uploadStore });
  });

  server.get("/api/v1/search/piratebay", async (req, res) => {
    let query = req.query.query;
    let site = req.query.site;
    if (query === "" || !query) {
      res.send({ error: true, errorMessage: "Search term cannot be empty" });
    } else {
      const data = await piratebaySearch(query, site);
      res.send(data);
    }
  });

  server.get("/api/v1/details/piratebay", async (req, res) => {
    let query = req.query.query;
    let site = req.query.site;
    if (query === "" || !query) {
      res.send({ error: true, errorMessage: "Search term cannot be empty" });
    } else {
      const data = await piratebayDetails(query, site);
      res.send(data);
    }
  });

  server.get("/api/v1/search/1337x", async (req, res) => {
    let query = req.query.query;
    let site = req.query.site;
    if (query === "" || !query) {
      res.send({ error: true, errorMessage: "Search term cannot be empty" });
    } else {
      const data = await o337xSearch(query, site);
      res.send(data);
    }
  });

  server.get("/api/v1/details/1337x", async (req, res) => {
    let query = req.query.query;
    let site = req.query.site;
    if (query === "" || !query) {
      res.send({ error: true, errorMessage: "Search term cannot be empty" });
    } else {
      const data = await o337xDetails(query, site);
      res.send(data);
    }
  });

  server.get("/api/v1/search/limetorrent", async (req, res) => {
    let query = req.query.query;
    let site = req.query.site;
    if (query === "" || !query) {
      res.send({ error: true, errorMessage: "Search term cannot be empty" });
    } else {
      const data = await limetorrentSearch(query, site);
      res.send(data);
    }
  });

  server.get("/api/v1/details/limetorrent", async (req, res) => {
    let query = req.query.query;
    let site = req.query.site;
    if (query === "" || !query) {
      res.send({ error: true, errorMessage: "Search term cannot be empty" });
    } else {
      const data = await limetorrentDetails(query, site);
      res.send(data);
    }
  });

  server.all("*", (req, res) => {
    handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`> Running on http://localhost:${PORT}`);
  });
})();
