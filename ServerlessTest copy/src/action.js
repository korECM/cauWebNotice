const URL = require("url");
// const {
//     uploadScreenshot
// } = require("./uploadScreenshot");

// Async takeScreenshot function.
// Takes a browser instance and a targetUrl
// Returns image URL uploaded to S3
exports.getHead = async (browser, targetUrl) => {
  // Open a new browser page
  const page = await browser.newPage();
  // Set browser size to something decent, mobile mode often tricks websites into loading faster
  await page.setViewport({
    width: 1920,
    height: 1080
  });

  // navigate to targetUrl page
  // wait for the page to load and stop making requests
  // The latter is important for modern SPAs that render after document is loaded
  await page.goto(targetUrl, {
    waitUntil: ["domcontentloaded", "networkidle2"]
  });

  let element = null;

  // // Get the exact DOM node we want to screenshot
  // // This is where you can keep adding any website you want :)
  // switch (URL.parse(await page.url()).hostname) {
  //     case "www.instagram.com":
  //         element = await page.$("article");
  //         break;
  // }

  // // Get the element's dimensions
  // const {
  //     x,
  //     y,
  //     width,
  //     height
  // } = await element.boundingBox();

  // construct a new filename
  // const imagePath = `/tmp/screenshot-${new Date().getTime()}.png`;

  // // Ask Puppeteer to take a screenshot
  // // save it to imagePath
  // await page.screenshot({
  //     path: imagePath,
  //     clip: {
  //         x: x + 2,
  //         y: y + 2,
  //         width: width - 2,
  //         height: height - 2
  //     }
  // });

  // upload screenshot to S3
  // const url = await uploadScreenshot(imagePath);
  await page.waitForSelector("h2");
  const message = await page.$$eval("h2", data => {
    return data.map(element => element.textContent);
  });
  // return the result
  return Promise.resolve(message);
};
