async function search(browser, search, site = "https://bayunblocked.net/") {
  try {
    var page = await browser.newPage();
    var link = site + "s/?q=" + search;
    await page.goto(link);

    var searchResults = await page.evaluate(async () => {
      var searchResults = document.querySelector("div#SearchResults");
      if (!searchResults) {
        return { error: false, results: [], totalResults: 0 };
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
        totalResults: results.length,
        errorMessage: ""
      };
    });

    await page.close();

    return searchResults;
  } catch (err) {
    console.log(err);
    return { error: true, errorMessage: "Runtime error occured" };
  }
}

module.exports = search;
