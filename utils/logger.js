const fs = require("fs");

const logFile = "./logs.txt";

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "=========== START ==========");
}

function logger(data) {
  try {
    const stringified = JSON.stringify(data);
    fs.appendFileSync(logFile, `\n${stringified}`);
  } catch (e) {
    fs.appendFileSync(logFile, `\n${data}`);
  }
}

module.exports = logger;
