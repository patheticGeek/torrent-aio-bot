const WebTorrent = require("webtorrent");
const fs = require("fs");
const prettyBytes = require("../utils/prettyBytes");
const humanTime = require("../utils/humanTime");
const mkfile = require("../utils/mkfile");
const ziper = require("../utils/ziper");
const { uploadWithLog } = require("../utils/gdrive");
const dev = process.env.NODE_ENV !== "production";
const site = (dev ? require("../config").site : process.env.SITE) || "SET SITE ENVIORMENT VARIABLE. READ DOCS";

if (!site) console.log("SET SITE ENVIORMENT VARIABLE. READ DOCS\n");

class Torrent {
  constructor() {
    this.downloads = [];
    this.client = new WebTorrent();
    setInterval(() => {
      this.downloads = this.client.torrents.map(torrent => this.get(torrent.magnetURI));
    }, 3000);
  }

  statusLoader = torrent => {
    return {
      status: torrent.done ? "Downloaded" : torrent.name ? "Downloading" : "Getting metadata",
      magnetURI: torrent.magnetURI,
      name: torrent.name,
      speed: `${prettyBytes(torrent.downloadSpeed)}/s`,
      downloaded: prettyBytes(torrent.downloaded),
      total: prettyBytes(torrent.length),
      progress: parseInt(torrent.progress * 100),
      timeRemaining: parseInt(torrent.timeRemaining),
      redableTimeRemaining: humanTime(torrent.timeRemaining),
      downloadLink: `${site}downloads/${torrent.infoHash}`,
      done: torrent.done
    };
  };

  download = (magnetURI, onStart, onDone) => {
    if (!this.client.get(magnetURI)) {
      const torrent = this.client.add(magnetURI);

      torrent.once("metadata", () => {
        if (onStart) onStart(this.get(torrent.magnetURI));
      });

      torrent.once("done", () => {
        this.saveFiles(torrent);
        if (onDone) onDone(this.get(torrent.magnetURI));
      });
      return torrent;
    } else {
      if (onDone) onDone(this.get(this.client.get(magnetURI).magnetURI));
    }
  };

  remove = magnetURI => {
    this.client.get(magnetURI) ? this.client.remove(magnetURI) : undefined;
    return null;
  };

  list = () => this.downloads;

  get = magnetURI => {
    const torr = this.client.get(magnetURI);
    return torr ? this.statusLoader(torr) : null;
  };

  saveFiles = async torrent => {
    torrent.files.forEach((file, i) => {
      const filePath = "./downloads/" + torrent.infoHash + "/" + file.path;
      mkfile(filePath);
      let toFile = fs.createWriteStream(filePath);
      let torrentFile = file.createReadStream();
      torrentFile.pipe(toFile);
    });
    try {
      ziper(`./downloads/${torrent.infoHash}/${torrent.name}`);
    } catch (e) {
      console.log(e);
    }
    uploadWithLog(`./downloads/${torrent.infoHash}/${torrent.name}`);
  };
}

module.exports = Torrent;
