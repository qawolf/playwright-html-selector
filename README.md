# playwright-html-selector

🔍 Find elements by their HTML.

## Install

```sh
npm i playwright playwright-html-selector
```

### Use

```
const { chromium } = require("playwright");
const { register } = require("playwright-html-selector");

(async () => {
  register();

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://example.com");

  // use an html selector
  await page.click('html=<a href="https://www.iana.org/domains/example">More information...</a>')

  await browser.close();
})();
```
