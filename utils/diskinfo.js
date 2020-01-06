const disk = require("diskusage");
const prettyBytes = require("../utils/prettyBytes");

async function diskinfo(path = "/") {
  try {
    const { available, free, total } = await disk.check(path);
    return {
      path,
      info: {
        available: prettyBytes(available),
        free: prettyBytes(free),
        total: prettyBytes(total)
      }
    };
  } catch (e) {
    console.log(e);
    return { path, info: null };
  }
}

module.exports = diskinfo;
