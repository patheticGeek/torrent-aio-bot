const { zip } = require("zip-a-folder");

async function ziper(folderPath, savePath) {
  try {
    if (!savePath) {
      var a = folderPath.split("/");
      var name = a.pop();
      savePath = a.join("/") + `/${name}.zip`;
    }
    await zip(folderPath, savePath);
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = ziper;
