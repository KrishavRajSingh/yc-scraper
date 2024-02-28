const puppeteer = require("puppeteer");
const getCompanies = require("./script");
const fs = require("fs").promises;

const list = [];
(async () => {
  const links = await getCompanies();
  console.log(links);

  const browser = await puppeteer.launch({ headless: false });

  let page1 = await browser.newPage();
  let page2 = await browser.newPage();
  let page3 = await browser.newPage();
  let page4 = await browser.newPage();
  let page5 = await browser.newPage();

  while (links.length > 0) {
    await Promise.all([
      getData(links.shift(), page1),
      getData(links.shift(), page2),
      getData(links.shift(), page3),
      getData(links.shift(), page4),
      getData(links.shift(), page5),
    ]);
  }
  async function getData(link, page) {
    await page.goto(link, { timeout: 0 });
    await page.waitForSelector(".ycdc-card >>> a", { timeout: 0 });
    let ghLink = await page.$$eval(".ycdc-card >>> a", (links) => {
      return links.map((link) => link.href);
    });
    console.log(ghLink);
    list.push(ghLink);
    return;
  }
  await fs.appendFile("output.txt", list);
  await browser.close();
})();
