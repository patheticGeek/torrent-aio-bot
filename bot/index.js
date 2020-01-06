const Telegram = require("node-telegram-bot-api");
const fetch = require("isomorphic-unfetch");
const dev = process.env.NODE_ENV !== "production";
const token = dev ? require("./token") : process.env.TELEGRAM_TOKEN;
const api = "https://torrent-aio-bot.herokuapp.com/api/v1";

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

  const data = await fetch(api + "/search/piratebay?query=" + query);
  if (data.error) {
    bot.sendMessage(from, "An error occured on server");
  } else if (data.totalResults === 0) {
    bot.sendMessage(from, "No results found.");
  } else if (data.results.lenght > 0) {
    let results = "";
    data.results.forEach(result => {
      results += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
    });
    bot.sendMessage(from, results);
  }
});

module.exports = bot;
