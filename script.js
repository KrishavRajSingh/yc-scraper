const puppeteer = require("puppeteer");
async function getCompanies() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto("https://www.ycombinator.com/companies?batch=S23");
  await page.waitForSelector("._company_19sud_339");

  const tOrgsText = await page.$eval(
    "._message_19sud_543",
    (tOrg) => tOrg.innerText
  );
  const tOrgs = tOrgsText.split(" ")[3];
  let cLength = await page.$$eval("._company_19sud_339", (orgs) => orgs.length);
  await scrollToBottom(tOrgs, cLength, page);
  await page.waitForSelector("._company_19sud_339");
  const links = await page.$$eval("._company_19sud_339", (orgs) => {
    return orgs.map((org) => org.href);
  });
  cLength = await page.$$eval("._company_19sud_339", (orgs) => orgs.length);
  async function scrollToBottom() {
    while (tOrgs - cLength > 0) {
      await page.evaluate(async () => {
        // Scroll to the bottom of the page
        function scroll() {
          // For modern browsers
          document.documentElement.scrollTop =
            document.documentElement.scrollHeight;

          // For older browsers
          document.body.scrollTop = document.body.scrollHeight;
        }

        // Call the function to scroll to the bottom
        scroll();
      });
      cLength = await page.$$eval("._company_19sud_339", (orgs) => orgs.length);
    }
  }
  // await browser.close();
  return links;
};
module.exports = getCompanies;