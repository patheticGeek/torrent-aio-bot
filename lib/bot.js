const axios = require("axios");

const status = require("../utils/status");
const diskinfo = require("../utils/diskinfo");
const humanTime = require("../utils/humanTime");

const api = "https://torrent-aio-bot.herokuapp.com/api/v1";

const searchRegex = /\/search (piratebay|limetorrent|1337x) (.+)/;
const detailsRegex = /\/details (piratebay|limetorrent|1337x) (.+)/;
const downloadRegex = /\/download (.+)/;

const startMessage = `
Welcome, here are some commands to get you started:

There are 3 sites available at the movement: piratebay, 1337x and limetorrent

/search {site} {query} - To search for torrents
query is what you want to search for
eg. 
    /search piratebay Chernobyl
    /search piratebay Chernobyl 720p
    /search 1337x Lust Stories

/details {site} {link} - To get details of torrent
link is the link to the torrent page
eg. 
    /details piratebay https://bayunblocked.net/torrent/.....
    /details 1337x https://1337x.to/torrent/.....
`;

function bot(torrent, bot) {
  bot.onText(/\/start/, async msg => {
    bot.sendMessage(msg.chat.id, startMessage);
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

  bot.onText(searchRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "Searching...");

    const data = await axios(`${api}/search/${site}?query=${query}`).then(
      ({ data }) => data
    );

    if (!data || data.error) {
      bot.sendMessage(from, "An error occured on server");
    } else if (!data.results || data.results.length === 0) {
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

  bot.onText(detailsRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

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
  });

  bot.onText(downloadRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a magnet link");
    } else {
      bot.sendMessage(from, "Starting download...");
      try {
        torrent.download(link, torrent =>
          bot.sendMessage(
            from,
            `Name: ${torrent.name}\nStatus: ${torrent.status}\nSize: ${torrent.total}\nInfo Hash: ${torrent.infoHash}`
          )
        );
      } catch (e) {
        bot.sendMessage(from, "An error occured\n" + e.message);
      }
    }
  });
}

module.exports = bot;
