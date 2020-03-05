const puppeteer = require("puppeteer");
const PIRATEBAY_SITE =
  process.env.PIRATEBAY_SITE || "https://thepiratebay.org/search/{term}";

async function search(search, site = PIRATEBAY_SITE) {
  try {
    var browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    var page = await browser.newPage();
    await page.goto(site.replace("{term}", search));

    var searchResults = await page.evaluate(async () => {
      var searchResults = document.querySelector("div#SearchResults");
      if (!searchResults) {
        return { error: true, errorMessage: "No results found" };
      }
      var tableRows = searchResults.querySelectorAll("tr");
      var results = [];

      tableRows.forEach(item => {
        if (item.classList.value === "header") {
        } else {
          results.push({
            name: item.querySelectorAll("td")[1].querySelector("a").innerText,
            link: item.querySelectorAll("td")[1].querySelector("a").href,
            seeds: item.querySelectorAll("td")[2].innerText,
            details: item
              .querySelectorAll("td")[1]
              .querySelector("font.detDesc").innerText
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
