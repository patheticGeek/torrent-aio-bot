async function details(browser, link) {
  try {
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

    return torrentDetails;
  } catch (err) {
    console.log(err);
    return { error: true, message: "Runtime error occured" };
  }
}

module.exports = details;
