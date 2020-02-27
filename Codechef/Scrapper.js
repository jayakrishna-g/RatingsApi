const puppeteer = require('puppeteer');

const CCRankList = async function (result, url,num_pages) {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setRequestInterception(true);
    page.waitForNavigation( { timeout: 0, waitUntil: 'domcontentloaded' });
    
    let final_ret=[];
    page.on('request', (req) => {
        if ( req.resourceType()=='manifest' ||req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    // https://www.codechef.com/rankings/FEB20B?filterBy=Institution%3DCMR%20College%20of%20Engineering%20%26%20Technology%2C%20Hyderabad&order=asc&page=6&sortBy=rank
    await page.goto(url + '&order=asc&page='+1+'&sortBy=rank');
    const data = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('tr.ember-view'));
        const pgs= Array.from(document.querySelectorAll('.jump'))
        let ret=[]
        for(let i=0;i<tds.length;i++)
        {
            arr=tds[i].innerText.split('\n')
            ret.push({RollNumber : arr[2].substring(2) , Rank : arr[0]})
        }
        return ret;
    });
    data.forEach(element => {
        final_ret.push(element)
    });
    result.ranklist = final_ret;
    await page.close();
    await browser.close();
}

module.exports = {
    getRanklist: CCRankList
}