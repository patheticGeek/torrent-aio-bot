const Telegram = require("node-telegram-bot-api");
const dev = process.env.NODE_ENV !== "production";
const token = require("./token");

const bot = new Telegram(token, { polling: true });

if (!dev) {
  console.log("using webhook");
  bot.setWebHook("https://torrent-aio-bot.herokuapp.com/torrent-bot");
}

bot.on("message", function(msg) {
  var chatId = msg.chat.id;
  bot.sendMessage(chatId, "Recived.");
});

module.exports = bot;
