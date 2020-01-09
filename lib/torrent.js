const WebTorrent = require("webtorrent");
const fs = require("fs");
const prettyBytes = require("../utils/prettyBytes");
const humanTime = require("../utils/humanTime");
const mkfile = require("../utils/mkfile");
const downloadsLoad = require("../downloads.json");
const dev = process.env.NODE_ENV !== "production";
const site =
  (dev ? require("../config").site : process.env.SITE) ||
  "SET SITE ENVIORMENT VARIABLE. READ DOCS";

if (!site) console.log("SET SITE ENVIORMENT VARIABLE. READ DOCS");

class Torrent {
  constructor() {
    this.downloads = downloadsLoad;
    this.client = new WebTorrent();
  }

  updateDownloads = (id, data) => {
    this.downloads[id] = { ...this.downloads[id], ...data };
    const downloads = JSON.stringify(this.downloads);
    fs.writeFileSync("./downloads.json", downloads);
  };

  statusLoader = torrent => {
    return {
      infoHash: torrent.infoHash,
      magnetURI: torrent.magnetURI,
      name: torrent.name,
      speed: `${prettyBytes(torrent.downloadSpeed)}/s`,
      downloaded: prettyBytes(torrent.downloaded),
      total: prettyBytes(torrent.length),
      progress: parseInt(torrent.progress * 100),
      timeRemaining: parseInt(torrent.timeRemaining),
      redableTimeRemaining: humanTime(torrent.timeRemaining),
      files: torrent.files.map(file => ({
        name: file.name,
        downloaded: prettyBytes(file.downloaded),
        total: prettyBytes(file.length),
        progress: parseInt(file.progress * 100),
        path: file.path,
        downloadLink: `${site}api/v1/downloads/${torrent.infoHash}/${file.path}`
      }))
    };
  };

  addTorrent = (link, cb1, cb2) => {
    if (!this.client.get(link)) {
      const torrent = this.client.add(link);
      if (cb1) {
        torrent.on("metadata", () => cb1(this.statusLoader(torrent)));
      }
      torrent.once("done", () => {
        this.saveFiles(torrent);
        if (cb2) cb2(this.statusLoader(torrent));
      });
    }
  };

  removeTorrent = link => {
    this.client.get(link) ? this.client.remove(link) : undefined;
  };

  getTorrent = link => {
    let torrent = this.client.get(link);
    if (torrent) {
      const status = this.statusLoader(torrent);
      if (this.downloads[status.infoHash]) {
        return this.downloads[status.infoHash];
      } else {
        return status;
      }
    } else {
      return null;
    }
  };

  listTorrents = () => {
    return this.client.torrents.map(torrent => this.statusLoader(torrent));
  };

  getDownload = (type, link) => {
    if (type === "infoHash") {
      if (this.downloads[link]) {
        return this.downloads[link];
      } else {
        return null;
      }
    } else if (type === "magnet") {
      if (this.getTorrent(link) && this.getTorrent(link).status) {
        return this.downloads(this.getTorrent(link).infoHash);
      } else {
        return null;
      }
    }
  };

  listDownloads = () => {
    return Object.entries(this.downloads).map(v => v[1]);
  };

  saveFiles = torrent => {
    const torrentStatus = this.statusLoader(torrent);
    this.updateDownloads(torrent.infoHash, {
      status: "Saving files...",
      speed: "",
      ...torrentStatus
    });
    torrent.files.forEach((file, i) => {
      const filePath = "./downloads/" + torrent.infoHash + "/" + file.path;
      mkfile(filePath);
      let toFile = fs.createWriteStream(filePath);
      let torrentFile = file.createReadStream();
      torrentFile.pipe(toFile);
      this.updateDownloads(torrent.infoHash, {
        status: `${i + 1} of ${torrent.files.length} saved`
      });
    });
    this.updateDownloads(torrent.infoHash, {
      status: `Files saved`
    });
  };
}

module.exports = Torrent;
