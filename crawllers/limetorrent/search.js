const puppeteer = require("puppeteer");
const LIMETORRENT_SITE = process.env.LIMETORRENT_SITE || "https://limetorrents.at/search?search={term}";

async function search(search, site = LIMETORRENT_SITE) {
  try {
    var browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    await browser.userAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"
    );
    var page = await browser.newPage();
    await page.goto(site.replace("{term}", search));

    var searchResults = await page.evaluate(async () => {
      var searchResults = document.querySelector("table.table2 > tbody");
      if (!searchResults) {
        return { error: true, errorMessage: "No results found" };
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
            name: item.querySelector("td:nth-of-type(1) > div:nth-of-type(1) > a:nth-of-type(2)").innerText,
            link: item.querySelector("td:nth-of-type(1) > div:nth-of-type(1) > a:nth-of-type(2)").href,
            seeds: item.querySelector("td:nth-of-type(4)").innerText,
            details
          });
        }
      });

      return {
        error: false,
        results,
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
