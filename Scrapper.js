const puppeteer = require('puppeteer');

const CCRankList = async function (result, url) {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto(url);
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('.user-name'));
        return tds.map(td => td.innerText.substring(2));
    });
    result.ranklist = data;
    await page.close();
    await browser.close();
}

module.exports = {
    getRanklist: CCRankList
}