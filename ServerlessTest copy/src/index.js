const getChrome = require("./getChrome");
const puppeteer = require("puppeteer-core");
const { getHead } = require("./action");
// const { takeScreenshot } = require("./takeScreenshot.js");

// This is the handler function
// gets called when you hit the API endpoint
exports.handler = async (event, context, callback) => {
  // Instantiate a Chrome browser
  context.callbackWaitsForEmptyEventLoop = false;
  const chrome = await getChrome();

  // connect to the browser via a websocket using Puppeteer
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint
  });

  // CORS headers so we can make cross domain requests to our Lambda
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "access-control-allow-methods": "GET"
  };

  //   Bail out if there's no params
  //   if (!event.queryStringParameters) {
  //     callback(null, {
  //       statusCode: 400,
  //       headers,
  //       body: "You need a url"
  //     });
  //   }
  // Get the target URL from params
  let targetUrl = event.queryStringParameters.url;

  // Bail out if there's no URL
  if (!targetUrl) {
    //   callback(null, {
    //     statusCode: 400,
    //     headers,
    //     body: "You need something to do"
    //   });
    targetUrl = "https://velog.io/@velopert";
  }

  // Take screenshot, return result

  const message = await getHead(browser, targetUrl);

  await browser.close();
  setTimeout(() => chrome.instance.kill(), 0);
  try {
    callback(null, {
      statusCode: 200,
      headers,
      body: message
    });
  } catch (e) {
    callback(e);
  }
};
