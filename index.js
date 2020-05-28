const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const serveIndex = require("serve-index");

const humanTime = require("./utils/humanTime");
const keepalive = require("./utils/keepalive");
const diskinfo = require("./utils/diskinfo");
const status = require("./utils/status");
const { getFiles, sendFileStream, getAuthURL, getAuthToken } = require("./utils/gdrive");

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

server.use("/api/v1/drive/folder", async (req, res) => {
  const folderId = req.query.id;
  res.send(await getFiles(folderId));
});

server.use("/api/v1/drive/file/:slug", sendFileStream);

server.use("/api/v1/drive/getAuthURL", (req, res) => {
  const CLIENT_ID = req.query.clientId;
  const CLIENT_SECRET = req.query.clientSecret;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    res.send(JSON.stringify({ error: "Client Id and secret are required" }));
  } else {
    const authURL = getAuthURL(CLIENT_ID, CLIENT_SECRET);
    res.send(JSON.stringify({ error: "", authURL }));
  }
});

server.use("/api/v1/drive/getAuthToken", async (req, res) => {
  const CLIENT_ID = req.query.clientId;
  const CLIENT_SECRET = req.query.clientSecret;
  const AUTH_CODE = req.query.authCode;

  if (!CLIENT_ID || !CLIENT_SECRET || !AUTH_CODE) {
    res.send(JSON.stringify({ error: "Client Id and secret and auth code are required" }));
  } else {
    const token = await getAuthToken(CLIENT_ID, CLIENT_SECRET, AUTH_CODE);
    res.send(JSON.stringify({ token, error: "" }));
  }
});

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

server.use("/static", express.static("web/build/static"));
server.all("*", (req, res) => res.sendFile("web/build/index.html", { root: __dirname }));

server.listen(PORT, () => {
  console.log(`> Running on http://localhost:${PORT}`);
});
