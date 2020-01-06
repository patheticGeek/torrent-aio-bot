const Telegram = require("node-telegram-bot-api");
const axios = require("axios");
const disk = require("diskusage");
const prettyBytes = require("../lib/prettyBytes");
const humanTime = require("../lib/humanTime");

const dev = process.env.NODE_ENV !== "production";
const token = dev ? require("./token") : process.env.TELEGRAM_TOKEN;
const api = "https://torrent-aio-bot.herokuapp.com/api/v1";

if (token && token !== "") {
  const bot = new Telegram(token, { polling: true });

  bot.onText(/\/echo (.+)/, function(msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];

    bot.sendMessage(fromId, `you wrote: ${resp}`);
  });

  bot.onText(/\/search piratebay (.+)/, async (msg, match) => {
    var from = msg.from.id;
    var query = match[1];

    bot.sendMessage(from, "Searching...");

    const data = await axios(api + "/search/piratebay?query=" + query).then(
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
  });

  bot.onText(/\/search 1337x (.+)/, async (msg, match) => {
    var from = msg.from.id;
    var query = match[1];

    bot.sendMessage(from, "Searching...");

    const data = await axios(api + "/search/1337x?query=" + query).then(
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
  });

  bot.onText(/\/search limetorrent (.+)/, async (msg, match) => {
    var from = msg.from.id;
    var query = match[1];

    bot.sendMessage(from, "Searching...");

    const data = await axios(api + "/search/limetorrent?query=" + query).then(
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
  });

  bot.onText(/\/details piratebay (.+)/, async (msg, match) => {
    var from = msg.from.id;
    var query = match[1];

    bot.sendMessage(from, "Loading...");

    const data = await axios(api + "/details/piratebay?query=" + query).then(
      ({ data }) => data
    );
    if (!data || data.error) {
      bot.sendMessage(from, "An error occured");
    } else if (data.torrent) {
      const torrent = data.torrent;
      let result1 = "";
      let result2 = "";
      result1 += `Title: ${torrent.title} \n\nInfo: ${torrent.info} \n\nMagnet Link:`;
      torrent.details.forEach(item => {
        result2 += `${item.infoTitle} ${item.infoText} \n\n`;
      });
      bot.sendMessage(from, result1);
      bot.sendMessage(from, torrent.downloadLink);
      bot.sendMessage(from, result2);
    }
  });

  bot.onText(/\/details 1337x (.+)/, async (msg, match) => {
    var from = msg.from.id;
    var query = match[1];

    bot.sendMessage(from, "Loading...");

    const data = await axios(api + "/details/1337x?query=" + query).then(
      ({ data }) => data
    );
    if (!data || data.error) {
      bot.sendMessage(from, "An error occured");
    } else if (data.torrent) {
      const torrent = data.torrent;
      let result1 = "";
      let result2 = "";
      result1 += `Title: ${torrent.title} \n\nInfo: ${torrent.info} \n\nMagnet Link:`;
      torrent.details.forEach(item => {
        result2 += `${item.infoTitle} ${item.infoText} \n\n`;
      });
      bot.sendMessage(from, result1);
      bot.sendMessage(from, torrent.downloadLink);
      bot.sendMessage(from, result2);
    }
  });

  bot.onText(/\/details limetorrent (.+)/, async (msg, match) => {
    var from = msg.from.id;
    var query = match[1];

    bot.sendMessage(from, "Loading...");

    const data = await axios(api + "/details/limetorrent?query=" + query).then(
      ({ data }) => data
    );
    if (!data || data.error) {
      bot.sendMessage(from, "An error occured");
    } else if (data.torrent) {
      const torrent = data.torrent;
      let result1 = "";
      let result2 = "";
      result1 += `Title: ${torrent.title} \n\nInfo: ${torrent.info} \n\nMagnet Link:`;
      torrent.details.forEach(item => {
        result2 += `${item.infoTitle} ${item.infoText} \n\n`;
      });
      bot.sendMessage(from, result1);
      bot.sendMessage(from, torrent.downloadLink);
      bot.sendMessage(from, result2);
    }
  });

  bot.onText(/\/diskinfo (.+)/, async (msg, match) => {
    const from = msg.chat.id;
    const path = match[1];
    try {
      const { available, free, total } = await disk.check(path);
      const info = `Path: ${path} \nAvail: ${prettyBytes(
        available
      )} \nFree: ${prettyBytes(free)} \nTotal: ${prettyBytes(total)}`;
      bot.sendMessage(from, info);
    } catch (e) {
      console.log(e);
      bot.sendMessage("An error occured.");
    }
  });

  bot.onText(/\/uptime/, async (msg, match) => {
    const from = msg.chat.id;
    bot.sendMessage(from, humanTime(process.uptime() * 1000));
  });

  bot.onText(/\/status/, async (msg, match) => {
    const from = msg.chat.id;
    const path = "/app";
    try {
      const { available, free, total } = await disk.check(path);
      const info = `Avail: ${prettyBytes(available)} \nFree: ${prettyBytes(
        free
      )} \nTotal: ${prettyBytes(total)} \nUptime: ${humanTime(
        process.uptime() * 1000
      )}`;
      bot.sendMessage(from, info);
    } catch (e) {
      console.log(e);
      bot.sendMessage("An error occured.");
    }
  });
} else {
  console.warn("TELEGRAM_TOKEN not added. Bot not started");
}
