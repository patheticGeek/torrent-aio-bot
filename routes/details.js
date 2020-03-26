const express = require("express");
const piratebayDetails = require("../crawllers/piratebay/details");
const o337xDetails = require("../crawllers/1337x/details");
const limetorrentDetails = require("../crawllers/limetorrent/details");

const router = express.Router();

router.get("/piratebay", async (req, res) => {
  let query = req.query.query;

  if (query === "" || !query) {
    res.send({ error: true, errorMessage: "Search term cannot be empty" });
  } else {
    const data = await piratebayDetails(query);
    res.send(data);
  }
});

router.get("/1337x", async (req, res) => {
  let query = req.query.query;

  if (query === "" || !query) {
    res.send({ error: true, errorMessage: "Search term cannot be empty" });
  } else {
    const data = await o337xDetails(query);
    res.send(data);
  }
});

router.get("/limetorrent", async (req, res) => {
  let query = req.query.query;

  if (query === "" || !query) {
    res.send({ error: true, errorMessage: "Search term cannot be empty" });
  } else {
    const data = await limetorrentDetails(query);
    res.send(data);
  }
});

module.exports = router;
