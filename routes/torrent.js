const express = require("express");
const Torrent = require("../lib/torrent");
const bot = require("../lib/bot");
const torrent = new Torrent();

bot(torrent);
const router = express.Router();

router.get("/start", (req, res) => {
  const link = req.query.link;
  if (!link) {
    res.send({ error: true, errorMessage: "No link provided" });
  } else if (link.indexOf("magnet:") !== 0) {
    res.send({ error: true, errorMessage: "Link is not a magnet link" });
  } else {
    torrent.addTorrent(link);
    res.send({ error: false, link });
  }
});

router.get("/remove", (req, res) => {
  const link = req.query.link;
  if (!link) {
    res.send({ error: true, errorMessage: "No link provided" });
  } else {
    torrent.removeTorrent(link);
    res.send({ error: false, link });
  }
});

router.get("/status", (req, res) => {
  const link = req.query.link;
  if (!link) {
    res.send({ error: true, errorMessage: "No link provided" });
  } else {
    res.send({ error: false, status: torrent.getTorrent(link) });
  }
});

router.get("/list", (req, res) => {
  try {
    res.send({ error: false, torrents: torrent.listTorrents() });
  } catch (err) {
    console.log(err);
    res.send({ error: true, errorMessage: err.message });
  }
});

router.get("/downloads", (req, res) => {
  try {
    res.send({ error: false, downloads: torrent.listDownloads() });
  } catch (err) {
    console.log(err);
    res.send({ error: true, errorMessage: err.message });
  }
});

module.exports = router;
