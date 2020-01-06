const telegram = require("node-telegram-bot-api");
const axios = require("axios");

const status = require("../utils/status");
const diskinfo = require("../utils/diskinfo");
const humanTime = require("../utils/humanTime");

const dev = process.env.NODE_ENV !== "production";
const token = dev
  ? require("../config").telegramToken
  : process.env.TELEGRAM_TOKEN;
const api = "https://torrent-aio-bot.herokuapp.com/api/v1";

if (token && token !== "") {
  const bot = new telegram(token, { polling: true });

  bot.onText(/\/echo (.+)/, function(msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];

    bot.sendMessage(fromId, `you wrote: ${resp}`);
  });

  bot.onText(/\/search (.+) (.+)/, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    if (site === "piratebay" || site === "1337x" || site === "limetorrent") {
      bot.sendMessage(from, "Searching...");

      const data = await axios(`${api}/search/${site}?query=${query}`).then(
        ({ data }) => data
      );
      if (!data || data.error) {
        bot.sendMessage(from, "An error occured on server");
      } else if (data.totalResults === 0) {
        bot.sendMessage(from, "No results found.");
      } else if (data.results.length > 0) {
        let results1 = "";
        let results2 = "";
        let results3 = "";
        data.results.forEach((result, i) => {
          if (i <= 2) {
            results1 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
          } else if (2 < i && i <= 5) {
            results2 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
          } else if (5 < i && i <= 8) {
            results3 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
          }
        });
        bot.sendMessage(from, results1);
        bot.sendMessage(from, results2);
        bot.sendMessage(from, results3);
      }
    } else {
      bot.sendMessage(from, "Sites avail: piratebay, 1337x, limetorrent");
    }
  });

  bot.onText(/\/details (.+) (.+)/, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    if (site === "piratebay" || site === "1337x" || site === "limetorrent") {
      bot.sendMessage(from, "Loading...");

      const data = await axios(`${api}/details/${site}?query=${query}`).then(
        ({ data }) => data
      );
      if (!data || data.error) {
        bot.sendMessage(from, "An error occured");
      } else if (data.torrent) {
        const torrent = data.torrent;
        let result1 = "";
        let result2 = "";
        result1 += `Title: ${torrent.title} \n\nInfo: ${torrent.info}`;
        torrent.details.forEach(item => {
          result2 += `${item.infoTitle} ${item.infoText} \n\n`;
        });
        result2 += "Magnet Link:";
        await bot.sendMessage(from, result1);
        await bot.sendMessage(from, result2);
        await bot.sendMessage(from, torrent.downloadLink);
      }
    } else {
      bot.sendMessage(from, "Sites avail: piratebay, 1337x, limetorrent");
    }
  });

  bot.onText(/\/diskinfo (.+)/, async (msg, match) => {
    const from = msg.chat.id;
    const path = match[1];
    const info = await diskinfo(path);
    bot.sendMessage(from, info);
  });

  bot.onText(/\/uptime/, async msg => {
    const from = msg.chat.id;
    bot.sendMessage(from, humanTime(process.uptime() * 1000));
  });

  bot.onText(/\/status/, async msg => {
    const from = msg.chat.id;
    const currStatus = await status();
    bot.sendMessage(from, currStatus);
  });
} else {
  console.warn("TELEGRAM_TOKEN not added. Bot not started. Read docs.");
}
