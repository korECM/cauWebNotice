const chromium = require('chrome-aws-lambda');

module.exports.handler = async (event, context) => {

    // const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

    const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,
    });

    const page = await browser.newPage();

    let targetUrl = "https://velog.io/@";

    try {
        let id = event.pathParameters.id;
        targetUrl = targetUrl + id;
    } catch (e) {
        targetUrl = targetUrl + "velopert";
    }

    await page.goto(targetUrl);

    await page.waitForSelector("h2");
    const message = await page.$$eval("h2", data => {
        return data.map(element => element.textContent);
    });

    console.log("Hello");

    // const screenshot = await page.screenshot({
    //     encoding: 'binary'
    // });

    await browser.close();
    setTimeout(() => chrome.instance.kill(), 0);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: ` Data is Here : ${message}`
        })
    }

}