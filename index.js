const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const serveIndex = require("serve-index");

const humanTime = require("./utils/humanTime");
const keepalive = require("./utils/keepalive");
const diskinfo = require("./utils/diskinfo");
const status = require("./utils/status");
const { getFiles, sendFileStream } = require("./utils/gdrive");

const search = require("./routes/search");
const details = require("./routes/details");
const torrent = require("./routes/torrent");

const dev = process.env.NODE_ENV !== "production";
const PORT = parseInt(process.env.PORT, 10) || 3000;

const server = express();

keepalive();

server.use(compression());
server.use(bodyParser.json());
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

server.get("/ping", (req, res) => res.send("pong"));

server.get("/logs", (req, res) => res.sendFile("logs.txt", { root: __dirname }));

server.use("/downloads", express.static("downloads"), serveIndex("downloads", { icons: true }));

server.use("/drive/folder", async (req, res) => {
  const folderId = req.query.id;
  res.send(await getFiles(folderId));
});

server.use("/drive/file/:slug", sendFileStream);

server.use("/api/v1/torrent", torrent);
server.use("/api/v1/search", search);
server.use("/api/v1/details", details);

server.get("/api/v1/uptime", async (req, res) => {
  res.send({ uptime: humanTime(process.uptime() * 1000) });
});

server.get("/api/v1/diskinfo", async (req, res) => {
  const path = req.query.path;
  const info = await diskinfo(path);
  res.send(info);
});

server.get("/api/v1/status", async (req, res) => {
  const currStatus = await status();
  res.send(currStatus);
});

server.all("*", express.static("web/build"));

server.listen(PORT, () => {
  console.log(`> Running on http://localhost:${PORT}`);
});
