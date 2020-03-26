const diskinfo = require("./diskinfo");
const humanTime = require("../utils/humanTime");
const prettyBytes = require("./prettyBytes");

async function status(path = "/app") {
  let info = "";

  try {
    let dinfo = await diskinfo(path);
    const memory = process.memoryUsage();

    if (typeof dinfo === "string") throw Error(dinfo);

    info += `Disk Avail: ${dinfo.available} \n`;
    info += `Disk Total: ${dinfo.total} \n`;
    info += `Disk Free: ${dinfo.free} \n`;
    info += `Memory Total: ${prettyBytes(memory.external)} \n`;
    info += `Heap Total: ${prettyBytes(memory.heapTotal)} \n`;
    info += `Heap Used: ${prettyBytes(memory.heapUsed)} \n`;
    info += `Memory Rss: ${prettyBytes(memory.rss)} \n`;
    info += `Uptime: ${humanTime(process.uptime() * 1000)} \n`;

    return info;
  } catch (e) {
    console.log(e);
    info = e.message;
    return info;
  }
}

module.exports = status;
