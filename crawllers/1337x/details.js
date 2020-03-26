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
      var detailsFrame = document.querySelector("div.torrent-detail-page");
      var title = detailsFrame.querySelector("div.box-info-heading>h1").innerText;
      var downloadLink = detailsFrame.querySelector("div:nth-of-type(2)>div:nth-of-type(1)>ul>li>a").href;
      var info = "";

      var infoTitles = detailsFrame.querySelectorAll("ul.list > li > strong");
      var infoTexts = detailsFrame.querySelectorAll("ul.list > li > span");
      var i = 0;
      var details = [];

      infoTitles.forEach(text => {
        details.push({
          infoTitle: text.innerText,
          infoText: infoTexts[i].innerText
        });
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
