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
const startMessage = `
Welcome, here are some commands to get you started:

/status - Give some stats about server

There are 3 sites available at the movement: piratebay, 1337x and limetorrent

/search {site} {query} - To search for torrents
query is what you want to search for

/details {site} {link} - To get details of torrent
link is the link to the torrent page

/torrent start {magnet link}	Starts the download of torrent

/torrent remove {magnet link}	Removes the torrent at the magnet link if added

/torrent status {magnet link}	Gives the status of torrent

/torrent download {magnet link}	Gives the download link of torrent if downloaded
`;

function bot(torrent) {
  if (token && token !== "") {
    const bot = new telegram(token, { polling: true });

    bot.onText(/\/echo (.+)/, function(msg, match) {
      var fromId = msg.from.id;
      var resp = match[1];

      bot.sendMessage(fromId, `you wrote: ${resp}`);
    });

    bot.onText(/\/start/, async msg => {
      bot.sendMessage(msg.chat.id, startMessage);
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

    bot.onText(/\/torrent start (.+)/, async (msg, match) => {
      const from = msg.chat.id;
      const link = match[1];

      const onAdded = torr => {
        let result = "";
        result += `Name: ${torr.name}\n\n`;
        result += `Speed: ${torr.speed}\n\n`;
        result += `Downloaded: ${torr.downloaded}\n\n`;
        result += `Total: ${torr.total}\n\n`;
        result += `Progress: ${torr.progress}%\n\n`;
        result += `Time remaining: ${torr.redableTimeRemaining}\n\n`;
        if (torr.files) result += `No of files: ${torr.files.length}\n\n`;
        result += `Magnet Link: \n${torr.magnetURI}`;
        bot.sendMessage(from, result);
      };

      const onDone = async torr => {
        let result1 = "";
        result1 += `Name: ${torr.name}\n\n`;
        result1 += `Total: ${torr.total}\n\n`;
        result1 += `Magnet Link: \n${torr.magnetURI}\n\n`;
        result1 += `Files: `;

        await bot.sendMessage(from, result1);
        let result2 = [];
        torr.files.forEach(file => {
          let a = "";
          a += `Name: ${file.name}\n\n`;
          a += `Download Link: \n ${file.downloadLink}`;
          result2.push(a);
        });
        result2.forEach(item => {
          bot.sendMessage(from, item);
        });
      };

      if (link.indexOf("magnet:") !== 0) {
        bot.sendMessage(from, "Link is not a magnet link");
      } else if (torrent.getTorrent(link)) {
        bot.sendMessage(from, "Already added");
      } else {
        bot.sendMessage(from, "Starting download...");
        torrent.addTorrent(link, onAdded, onDone);
      }
    });

    bot.onText(/\/torrent remove (.+)/, async (msg, match) => {
      const from = msg.chat.id;
      const link = match[1];

      torrent.removeTorrent(link);
      bot.sendMessage(from, "Removed.");
    });

    bot.onText(/\/torrent status (.+)/, async (msg, match) => {
      const from = msg.chat.id;
      const link = match[1];

      const status = torrent.getTorrent(link);
      let result = "";
      result += `Name: ${status.name}\n\n`;
      result += `Speed: ${status.speed}\n\n`;
      result += `Downloaded: ${status.downloaded}\n\n`;
      result += `Total: ${status.total}\n\n`;
      result += `Time remaining: ${status.redableTimeRemaining}\n\n`;
      result += `Magnet Link: ${status.magnetURI}`;
      bot.sendMessage(from, result);
    });

    bot.onText(/\/torrent download (.+)/, async (msg, match) => {
      const from = msg.chat.id;
      const link = match[1];

      const torr = torrent.getDownload("magnet", link);
      if (torr) {
        let result1 = "";
        result += `Name: ${torr.status}\n\n`;
        result1 += `Name: ${torr.name}\n\n`;
        result1 += `Total: ${torr.total}\n\n`;
        result1 += `Magnet Link: \n${torr.magnetURI}\n\n`;
        result1 += `Files: `;

        await bot.sendMessage(from, result1);
        let result2 = [];
        torr.files.forEach(file => {
          let a = "";
          a += `Name: ${file.name}\n\n`;
          a += `Download Link: \n ${file.downloadLink}`;
          result2.push(a);
        });
        result2.forEach(item => {
          bot.sendMessage(from, item);
        });
      } else {
        bot.sendMessage(from, "Dosent exists or still downloading");
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
}

module.exports = bot;
