const express = require("express");

const piratebaySearch = require("../crawllers/piratebay/search");
const o337xSearch = require("../crawllers/1337x/search");
const limetorrentSearch = require("../crawllers/limetorrent/search");

const router = express.Router();

router.get("/piratebay", async (req, res) => {
  let query = req.query.query;

  if (query === "" || !query) {
    res.send({ error: true, errorMessage: "Search term cannot be empty" });
  } else {
    const data = await piratebaySearch(query);
    res.send(data);
  }
});

router.get("/1337x", async (req, res) => {
  let query = req.query.query;

  if (query === "" || !query) {
    res.send({ error: true, errorMessage: "Search term cannot be empty" });
  } else {
    const data = await o337xSearch(query);
    res.send(data);
  }
});

router.get("/limetorrent", async (req, res) => {
  let query = req.query.query;

  if (query === "" || !query) {
    res.send({ error: true, errorMessage: "Search term cannot be empty" });
  } else {
    const data = await limetorrentSearch(query);
    res.send(data);
  }
});

module.exports = router;
