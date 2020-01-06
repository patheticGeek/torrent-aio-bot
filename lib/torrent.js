const WebTorrent = require("webtorrent");

class Torrent {
  constructor() {
    uploading = {};
    client = new WebTorrent();
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
      this.client.add(link);
    }
  };

  removeTorrent = link => {
    if (torrentClient.get(link)) {
      torrentClient.remove(link);
    }
  };

  getTorrent = link => {
    let torrent = torrentClient.get(link);
    if (torrent) {
      return this.statusLoader(torrent);
    } else {
      return null;
    }
  };

  listTorrents = () => {
    return torrentClient.torrents.map(torrent => this.statusLoader(torrent));
  };
}

module.exports = Torrent;
