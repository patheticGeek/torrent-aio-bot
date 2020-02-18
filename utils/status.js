const diskinfo = require("./diskinfo");
const humanTime = require("../utils/humanTime");

async function status(path = "/app") {
  let info = "";
  try {
    let dinfo = await diskinfo(path);
    const memory = process.memoryUsage();
    if (typeof dinfo === "string") throw Error(dinfo);
    info += `Disk Avail: ${dinfo.available} \n`;
    info += `Disk Total: ${dinfo.total} \n`;
    info += `Disk Free: ${dinfo.free} \n`;
    info += `Memory Total: ${memory.external}`;
    info += `Heap Total: ${memory.heapTotal}`;
    info += `Heap Used: ${memory.heapUsed}`;
    info += `Memory Rss: ${memory.rss}`;
    info += `Uptime: ${humanTime(process.uptime() * 1000)} \n`;
    return info;
  } catch (e) {
    console.log(e);
    info = e.message;
    return info;
  }
}

module.exports = status;
