const WebTorrent = require("webtorrent");
const fs = require("fs");
const path = require("path");
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

  download = (magnetURI, onStart, onDone, onDriveUpload, onDriveUploadStart) => {
    if (!this.client.get(magnetURI)) {
      const torrent = this.client.add(magnetURI);

      torrent.once("metadata", () => {
        if (onStart) onStart(this.get(torrent.magnetURI));
      });

      torrent.once("done", () => {
        this.saveFiles(torrent, onDriveUpload, onDriveUploadStart);
        if (onDone) onDone(this.get(torrent.magnetURI));
      });

      return torrent;
    } else if (!this.client.get(magnetURI).done) {
      const torrent = this.client.get(magnetURI);
      return torrent;
    } else {
      const torrent = this.client.get(magnetURI);
      if (onDone) onDone(this.get(this.client.get(magnetURI).magnetURI));
      return torrent;
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

  saveFiles = async (torrent, onDriveUpload, onDriveUploadStart) => {
    torrent.files.forEach((file, i) => {
      let filePath;
      if (torrent.files.length === 1) filePath = `./downloads/${torrent.infoHash}/${file.path}/${file.path}`;
      else filePath = `./downloads/${torrent.infoHash}/${file.path}`;
      //mkfile(filePath);
      fs.mkdirSync(path.dirname(filePath), {recursive: true});
      let toFile = fs.createWriteStream(filePath);
      let torrentFile = file.createReadStream();
      torrentFile.pipe(toFile);
    });
    try {
      ziper(`./downloads/${torrent.infoHash}/${torrent.name}`);
      const torr = this.statusLoader(torrent);
      if (onDriveUploadStart) onDriveUploadStart(torr);
      const url = await uploadWithLog(`./downloads/${torrent.infoHash}/${torrent.name}`);
      if (onDriveUpload) onDriveUpload(torr, url);
    } catch (e) {
      console.log(e);
    }
  };
}

module.exports = Torrent;
