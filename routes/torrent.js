const express = require("express");
const telegram = require("node-telegram-bot-api");
const Torrent = require("../lib/torrent");
const botInit = require("../lib/bot");
const torrent = new Torrent();

const dev = process.env.NODE_ENV !== "production";
const site = dev ? require("../config").site : process.env.SITE;
const token = dev ? require("../config").telegramToken : process.env.TELEGRAM_TOKEN;

const router = express.Router();

if (!token)
  console.log(
    "Set telegram token env var to start telegram bot. Read docs at https://github.com/patheticGeek/torrent-aio-bot"
  );

if (site && token) {
  const botOptions = dev ? { polling: true } : {};
  const bot = new telegram(token, botOptions);
  if (!dev) {
    router.post("/bot", (req, res) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    });
    bot.setWebHook(`${site}api/v1/torrent/bot`);
  } else {
    router.post("/bot", (req, res) => {
      res.sendStatus(200);
    });
  }
  botInit(torrent, bot);
  console.log("Bot ready");
}

router.get("/download", (req, res) => {
  const link = req.query.link;

  if (!link) {
    res.send({ error: true, errorMessage: "No link provided" });
  } else if (link.indexOf("magnet:") !== 0) {
    res.send({ error: true, errorMessage: "Link is not a magnet link" });
  } else {
    torrent.download(link, torr => res.send({ error: false, magnetURI: torr.magnetURI }));
  }
});

router.get("/status", (req, res) => {
  const link = req.query.link;

  if (!link) {
    res.send({ error: true, errorMessage: "No link provided" });
  } else {
    try {
      res.send({ error: false, status: torrent.get(link) });
    } catch (e) {
      res.send({ error: false, errorMessage: e.message });
    }
  }
});

router.get("/remove", (req, res) => {
  const link = req.query.link;

  if (!link) {
    res.send({ error: true, errorMessage: "No link provided" });
  } else {
    try {
      torrent.remove(link);
      res.send({ error: false });
    } catch (e) {
      res.send({ error: true, errorMessage: e.message });
    }
  }
});

router.get("/list", (req, res) => {
  try {
    res.json({
      error: false,
      torrents: torrent.list()
    });
  } catch (e) {
    res.json({ error: true, errorMessage: e.message });
  }
});

module.exports = router;
