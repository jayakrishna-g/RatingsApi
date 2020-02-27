const puppeteer = require('puppeteer');

const CCRankList = async function (result, url) {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setRequestInterception(true);
    page.waitForNavigation( { timeout: 60000, waitUntil: 'domcontentloaded' });

    page.on('request', (req) => {
        if (  req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto(url);
    const data = await page.evaluate(() => {
        let tds = Array.from(document.querySelectorAll('.leaderboard-list-view'));
        console.log(tds)
        let ret=[];
        for(let i=0;i<tds.length;i++)
        {
            arr=tds[i].innerText.split('\n')
            ret.push({RollNumber : arr[2] , Rank : arr[0]})
        }
        return ret;
    });
    result.ranklist = data;
    await page.close();
    await browser.close();
}

module.exports = {
    getRanklist: CCRankList
}