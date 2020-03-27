const puppeteer = require('puppeteer');
const async = require('async')

module.exports.getLeaderBoard = async (url,num_pages,callback) => {
    
    let browser = await puppeteer.launch({ headless: false });
    await async.concat(num_pages , async function(p,next)  {
        let page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() == 'media' || req.resourceType() == 'image' || req.resourceType() == 'stylesheet') {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        // https://www.codechef.com/rankings/FEB20B?filterBy=Institution%3DCMR%20College%20of%20Engineering%20%26%20Technology%2C%20Hyderabad&order=asc&page=6&sortBy=rank
        console.log(url + '&order=asc&page='+p+'&sortBy=rank')
        await page.goto(url + '&order=asc&page='+p+'&sortBy=rank');
        const data = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('tr.ember-view'));
            const pgs= Array.from(document.querySelectorAll('.jump'))
            let ret=[]
            for(let i=0;i<tds.length;i++)
            {
                arr=tds[i].innerText.split('\n')
                ret.push({CodechefHandle : arr[2].substring(2) , Rank : arr[0]})
            }
            return ret;
        });
        await page.close();       
        return data
    } 
    ,
    (err,result) =>
    {
        browser.close();
        callback(err,result)
        
    }
);
}
