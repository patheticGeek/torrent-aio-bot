const fs = require("fs");

function mkfile(file) {
  file = file.split("/");
  const fileName = file.pop();

  file.forEach((val, i) => {
    if (val !== ".") {
      const currPath = file.slice(0, i + 1).join("/");
      if (!fs.existsSync(currPath)) {
        fs.mkdirSync(currPath);
      }
    }
  });

  file = file.join("/") + "/" + fileName;
  fs.writeFileSync(file);
}

module.exports = mkfile;
