const puppeteer = require("puppeteer");

async function details(link) {
  try {
    var browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    await browser.userAgent(
      "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.0 QQ-URL-Manager Mobile Safari/537.36"
    );
    var page = await browser.newPage();
    await page.goto(link);

    var torrentDetails = await page.evaluate(async () => {
      var detailsFrame = document.querySelector("div#maincontentrouter > div#content");
      var title = detailsFrame.querySelector("h1").innerText;
      var downloadLink = detailsFrame.querySelectorAll("a.csprite_dltorrent")[1].href;
      var info = "";

      var infoTitles = detailsFrame.querySelectorAll("div.torrentinfo > table > tbody > tr > td:nth-of-type(1)");
      var infoTexts = detailsFrame.querySelectorAll("div.torrentinfo > table > tbody > tr > td:nth-of-type(2)");
      var i = 0;
      var details = [];

      details.push({
        infoTitle: "Seeders",
        infoText: detailsFrame.querySelector("#content > span.greenish").innerText.replace("Seeders : ", "")
      });
      infoTitles.forEach(text => {
        details.push({
          infoTitle: text.innerText.replace(" :", ""),
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
