const express = require("express");
const puppeteer = require("puppeteer");

const piratebaySearch = require("../crawllers/piratebay/search");
const o337xSearch = require("../crawllers/1337x/search");
const limetorrentSearch = require("../crawllers/limetorrent/search");

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const browser = await puppeteer.launch();

    await browser.close();
    res.send({ error: false });
  } catch (e) {
    console.log("Puppeteer error");
    res.json({ error: true, errorMessage: e.message });
  }
});

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
