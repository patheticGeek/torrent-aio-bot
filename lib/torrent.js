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
    this.downloads = {};
    this.client = new WebTorrent();
  }

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
      downloadLink: `${site}downloads/${torrent.infoHash}`,
      done: torrent.done
    };
  };

  setDownload = (torrent, additional) => {
    if (torrent.done) additional.status = "Downloaded";
    this.downloads[torrent.infoHash] = {
      ...this.statusLoader(torrent),
      ...additional
    };
  };

  onDownloadStart = torrent => {
    this.setDownload(torrent, { status: "Downloading Metadata" });
  };

  onDownloadProgress = torrent => {
    this.setDownload(torrent, { status: "Downloading" });
  };

  onDownloadComplete = torrent => {
    this.setDownload(torrent, {
      status: "Downloaded",
      speed: "0 MB/s",
      timeRemaining: 0,
      progress: 100
    });
    this.saveFiles(torrent);
  };

  download = (link, onStart, onDone) => {
    if (!this.client.get(link)) {
      const torrent = this.client.add(link);

      torrent.on("metadata", () => {
        this.onDownloadStart(torrent);
        if (onStart) onStart(this.get(torrent.infoHash));
      });

      torrent.once("done", () => {
        this.onDownloadComplete(torrent);
        if (onDone) onDone(this.get(torrent.infoHash));
      });

      torrent.on("download", () => this.onDownloadProgress(torrent));
    } else {
      if (onDone) onDone(this.get(this.client.get(link).infoHash));
    }
  };

  remove = infoHash => {
    this.client.get(infoHash) ? this.client.remove(infoHash) : undefined;
    delete this.downloads[infoHash];
    return null;
  };

  get = infoHash => this.downloads[infoHash];

  saveFiles = torrent => {
    torrent.files.forEach((file, i) => {
      const filePath = "./downloads/" + torrent.infoHash + "/" + file.path;
      mkfile(filePath);
      let toFile = fs.createWriteStream(filePath);
      let torrentFile = file.createReadStream();
      torrentFile.pipe(toFile);
    });
    this.setDownload(torrent, { status: "Downloaded" });
  };
}

module.exports = Torrent;
