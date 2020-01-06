const diskinfo = require("./diskinfo");
const humanTime = require("../utils/humanTime");

async function status(path = "/app") {
  let info = "";
  try {
    let dinfo = await diskinfo(path);
    if (typeof dinfo === "string") throw Error(dinfo);
    info += `Avail: ${dinfo.available} \n`;
    info += `Total: ${dinfo.total} \n`;
    info += `Free: ${dinfo.free} \n`;
    info += `Uptime: ${humanTime(process.uptime() * 1000)} \n`;
    return info;
  } catch (e) {
    console.log(e);
    info = e.message;
    return info;
  }
}

module.exports = status;
