const WebTorrent = require("webtorrent");
const fs = require("fs");
const prettyBytes = require("../utils/prettyBytes");
const humanTime = require("../utils/humanTime");
const mkfile = require("../utils/mkfile");

class Torrent {
  constructor() {
    this.uploading = {};
    this.client = new WebTorrent();
  }

  statusLoader = torrent => {
    return {
      magnetURI: torrent.magnetURI,
      name: torrent.name,
      speed: `${prettyBytes(torrent.downloadSpeed)}/s`,
      downloaded: prettyBytes(torrent.downloaded),
      total: prettyBytes(torrent.length),
      progress: parseInt(torrent.progress * 100),
      timeRemaining: parseInt(torrent.timeRemaining),
      redableTimeRemaining: humanTime(torrent.timeRemaining),
      done: torrent.done,
      files: torrent.files.map(file => ({
        name: file.name,
        downloaded: prettyBytes(file.downloaded),
        total: prettyBytes(file.length),
        progress: parseInt(file.progress * 100),
        done: file.done,
        path: file.path
      }))
    };
  };

  addTorrent = link => {
    if (!this.client.get(link)) {
      const torrent = this.client.add(link);
      torrent.once("done", () => this.saveFiles(torrent));
    }
  };

  removeTorrent = link => {
    if (this.client.get(link)) {
      this.client.remove(link);
    }
  };

  getTorrent = link => {
    let torrent = this.client.get(link);
    if (torrent) {
      return this.statusLoader(torrent);
    } else {
      return null;
    }
  };

  listTorrents = () => {
    return this.client.torrents.map(torrent => this.statusLoader(torrent));
  };

  saveFiles = torrent => {
    torrent.files.forEach(file => {
      const filePath = "./downloads/" + file.path;
      mkfile(filePath);
      let toFile = fs.createWriteStream(filePath);
      let torrentFile = file.createReadStream();
      torrentFile.pipe(toFile);
    });
  };
}

module.exports = Torrent;
