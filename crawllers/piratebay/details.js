const puppeteer = require("puppeteer");

async function details(link) {
  try {
    var browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    var page = await browser.newPage();
    await page.goto(link);

    var torrentDetails = await page.evaluate(async () => {
      var detailsFrame = document.querySelector("div#detailsframe");
      var title = detailsFrame.querySelector("div#title").innerText;
      var downloadLink = detailsFrame.querySelector("div.download > a").href;
      var info = detailsFrame.querySelector("div.nfo > pre").innerText;

      var infoTitle = document.querySelectorAll("dt");
      var infoText = document.querySelectorAll("dd");
      var i = 0;
      var details = [];
      infoTitle.forEach(text => {
        if (text.innerText !== "Info Hash:" && text.innerText !== "Comments") {
          details.push({
            infoTitle: text.innerText,
            infoText: infoText[i].innerText
          });
        }
        i += 1;
      });

      return { error: false, torrent: { title, info, downloadLink, details } };
    });

    await page.close();
    await browser.close();

    return torrentDetails;
  } catch (err) {
    console.log(err);
    return { error: true, errorMessage: "Runtime error occured" };
  }
}

module.exports = details;
