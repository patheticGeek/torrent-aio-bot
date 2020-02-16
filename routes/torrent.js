const express = require("express");
const telegram = require("node-telegram-bot-api");
const Torrent = require("../lib/torrent");
const botInit = require("../lib/bot");
const torrent = new Torrent();

const dev = process.env.NODE_ENV !== "production";
const site = dev ? require("../config").site : process.env.SITE;
const token = dev
  ? require("../config").telegramToken
  : process.env.TELEGRAM_TOKEN;

const router = express.Router();

if (!token)
  console.log(
    "Set telegram token env var. Read docs at https://github.com/patheticGeek/torrent-aio-bot"
  );

if (site && token) {
  const botOptions = dev ? { polling: true } : {};
  const bot = new telegram(token, botOptions);
  if (!dev) {
    router.post("/bot", (req, res) => {
      bot.processUpdate(JSON.parse(req.body));
      res.sendStatus(200);
    });
    bot.setWebHook(`${site}bot`);
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
    torrent.addTorrent(link);
    res.send({ error: false, link });
  }
});

module.exports = router;
