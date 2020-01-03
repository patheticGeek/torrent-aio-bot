const puppeteer = require("puppeteer");

async function search(search, site = "https://www.limetorrents.info/") {
  try {
    var browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    await browser.userAgent(
      "Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.0 QQ-URL-Manager Mobile Safari/537.36"
    );
    var page = await browser.newPage();
    await page.goto(site + "search/all/" + search);

    var searchResults = await page.evaluate(async () => {
      var searchResults = document.querySelector("table.table2 > tbody");
      if (!searchResults) {
        return { error: false, results: [], totalResults: 0 };
      }
      var tableRows = searchResults.querySelectorAll("tr");
      var results = [];

      tableRows.forEach(item => {
        if (!item.querySelector("th")) {
          var details =
            "Added: " +
            item.querySelector("td:nth-of-type(2)").innerText +
            ", Size: " +
            item.querySelector("td:nth-of-type(3)").innerText;
          results.push({
            name: item.querySelector(
              "td:nth-of-type(1) > div:nth-of-type(1) > a:nth-of-type(2)"
            ).innerText,
            link: item.querySelector(
              "td:nth-of-type(1) > div:nth-of-type(1) > a:nth-of-type(2)"
            ).href,
            seeds: item.querySelector("td:nth-of-type(4)").innerText,
            details
          });
        }
      });

      return {
        error: false,
        results,
        totalResults: results.length,
        errorMessage: ""
      };
    });

    await page.close();
    await browser.close();

    return searchResults;
  } catch (err) {
    console.log(err);
    return { error: true, errorMessage: "Runtime error occured" };
  }
}

module.exports = search;
