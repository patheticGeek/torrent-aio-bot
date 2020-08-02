const axios = require("axios");

const status = require("../utils/status");
const diskinfo = require("../utils/diskinfo");
const humanTime = require("../utils/humanTime");
const { uploadFileStream } = require("../utils/gdrive");

const api = process.env.SEARCH_SITE || "https://torrent-aio-bot.herokuapp.com/";
console.log("Using api: ", api);

const searchRegex = /\/search (piratebay|limetorrent|1337x) (.+)/;
const detailsRegex = /\/details (piratebay|limetorrent|1337x) (.+)/;
const downloadRegex = /\/download (.+)/;
const statusRegex = /\/status (.+)/;
const removeRegex = /\/remove (.+)/;


function bot(torrent, bot) {
  bot.onText(/\/start/, async msg => {
  const opts = {
    reply_markup:{
      inline_keyboard: [
        [
          {
            text: 'Join our Team Drive',
            url: 'https://drive.google.com/drive/folders/0AMTkervhUwARUk9PVA'
          }
        ],
        [
          {
            text: 'Cloud Torrenter',
            url: 'https://cloudtorrenter.herokuapp.com'
          }
        ],
        [
          {
            text: 'Report Bugs',
            url: 'https://t.me/WhySooSerious'
          }
        ]
      ]
    },
    parse_mode: 'Markdown'
  };
  bot.sendMessage(msg.from.id, "*Dude, Do /help*", opts);
  });

  bot.onText(/\/donate/, async msg => {
  const opts = {
    reply_markup:{
      inline_keyboard: [
        [
          {
            text: 'Patreon ✅',
            url: 'https://www.patreon.com/WhySooSerious'
          }
        ],
        [
          {
            text: 'Share and Support ❤️',
            url: 'https://t.me/share/url?url=https://t.me/CloudTorrenterBOT'
          }
        ]
      ]
    },
    parse_mode: 'Markdown'
  };
  bot.sendMessage(msg.from.id, "*Thanks for showing interest in Donation.*\n\n_To Donate and Support me, you can send any Amount as you wish 😇 _.\n\nBecome my Patreon", opts);
  });


  bot.onText(/\/help/, async msg => {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Join our Team Drive',
              // we shall check for this value when we listen
              // for "callback_query"
              callback_data: 'drive'
            }
          ],
          [
            {
              text: 'Advanced Help',
              url: 'https://telegra.ph/Advanced-Help-for-Cloud-Torrenter-07-31'
            }
          ]
        ]
      },
      parse_mode: 'Markdown'
    };
    bot.sendMessage(msg.from.id, "*/search {site} {query}* - _To search for torrents_\n*/download {magnet link} -* _To start a download_\n*/status {magnet link} -* _To check status of a downloading torrent._\n*/remove {magnet link} -* _To remove an already added torrent_\n\n*Please Reffer Advanced Help for More Assistance*\n*Join our Team Drive 👇*", opts);
  });

  bot.on('callback_query', async callbackQuery => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    };
    let text;

    if (action === 'drive') {
      text = 'https://drive.google.com/drive/folders/0AMTkervhUwARUk9PVA';
    }

    bot.editMessageText(text, opts);
  });

  bot.on("message", async msg => {
    if (!msg.document) return;
    const chatId = msg.chat.id;
    const mimeType = msg.document.mimeType;
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;

    bot.sendMessage(chatId, "Uploading file...");
    try {
      const uploadedFile = await uploadFileStream(fileName, bot.getFileStream(fileId));
      const driveId = uploadedFile.data.id;
      const driveLink = `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
      const publicLink = `${process.env.SITE}api/v1/drive/file/${fileName}?id=${driveId}`;
      bot.sendMessage(chatId, `${fileName} upload successful\nDrive link: ${driveLink}\nPublic link: ${publicLink}`);
    } 
    catch (e) {
      bot.sendMessage(chatId, e.message || "An error occured");
    }
  });

  bot.onText(/\/server/, async msg => {
    const from = msg.chat.id;
    const currStatus = await status();
    bot.sendMessage(from, currStatus);
  });

  bot.onText(searchRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "SearchinG ⏳...");

    const data = await axios(`${api}api/v1/search/${site}?query=${query}`).then(({ data }) => data);

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

    const data = await axios(`${api}/details/${site}?query=${query}`).then(({ data }) => data);
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
    let messageObj = null;
    let torrInterv = null;

    const reply = async torr => {
      let mess1 = "";
      mess1 += `DownloadinG ⛕ :〘${torr.progress}%〙\n\n ${torr.name}\n\n`;
     
      mess1 += `Total Size : ${torr.total}\n`;
      if (!torr.done) {
        mess1 += `Downloaded : ${torr.downloaded}\n`;
        mess1 += `Download Speed : ${torr.speed}\n\n`;
       
        mess1 += `Time Left : ${torr.redableTimeRemaining}\n\n`;
        mess1 += `Please /donate any Amount you Wish to keep this Service Alive!\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
        clearInterval(torrInterv);
        torrInterv = null;
      }
      
      try {
        if (messageObj) {
          if (messageObj.text !== mess1) bot.editMessageText(mess1, { chat_id: messageObj.chat.id, message_id: messageObj.message_id });
        } else messageObj = await bot.sendMessage(from, mess1);
      } catch (e) {
        console.log(e.message);
      }
    };

    const onDriveUpload = (torr, url) => bot.sendMessage(from, `${torr.name} Uploaded to Gdrive\n${url}`);
    const onDriveUploadStart = torr => bot.sendMessage(from, `Uploading ${torr.name} to Gdrive`);

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a magnet link");
    } else {
      bot.sendMessage(from, "Starting download...");
      try {
        const torren = torrent.download(
          link,
          torr => reply(torr),
          torr => reply(torr),
          onDriveUpload,
          onDriveUploadStart
        );
        torrInterv = setInterval(() => reply(torrent.statusLoader(torren)), 5000);
      } catch (e) {
        bot.sendMessage(from, "An Error occured\n" + e.message);
      }
    }
  });

  bot.onText(statusRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    const torr = torrent.get(link);
    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a Magnet link");
    } else if (!torr) {
      bot.sendMessage(from, "Not downloading please add");
    } else {
      let mess1 = "";
      mess1 += `${torr.status}..\n\n ${torr.name}\n\n`;
      
      mess1 += `Size 👁‍🗨: ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `Downloaded : ${torr.downloaded}\n\n`;
        mess1 += `Speed : ${torr.speed}\n\n`;
        mess1 += `Percentage : ${torr.progress}%\n\n`;
        mess1 += `Time Remaining : ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
      }
      
      bot.sendMessage(from, mess1);
    }
  });

  bot.onText(removeRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    try {
      torrent.remove(link);
      bot.sendMessage(from, "Torrent Removed Successfully");
    } catch (e) {
      bot.sendMessage(from, `${e.message}`);
    }
  });
}

module.exports = bot;
