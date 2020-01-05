async function details(browser, link) {
  try {
    await browser.userAgent(
      "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.0 QQ-URL-Manager Mobile Safari/537.36"
    );
    var page = await browser.newPage();
    await page.goto(link);

    var torrentDetails = await page.evaluate(async () => {
      var detailsFrame = document.querySelector(
        "div#maincontentrouter > div#content"
      );
      var title = detailsFrame.querySelectorAll("a.csprite_dltorrent")[2].title;
      var downloadLink = detailsFrame.querySelectorAll("a.csprite_dltorrent")[2]
        .href;
      var info = "";

      var infoTitles = detailsFrame.querySelectorAll(
        "div.torrentinfo > table > tbody > tr > td:nth-of-type(1)"
      );
      var infoTexts = detailsFrame.querySelectorAll(
        "div.torrentinfo > table > tbody > tr > td:nth-of-type(2)"
      );
      var i = 0;
      var details = [];

      details.push({
        infoTitle: "Seeders",
        infoText: detailsFrame
          .querySelector("#content > span.greenish")
          .innerText.replace("Seeders : ", "")
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

    return torrentDetails;
  } catch (err) {
    console.log(err);
    return { error: true, message: "Runtime error occured" };
  }
}

module.exports = details;
