const async = require('async')
const axios = require('axios')


module.exports.getLeaderBoard = (name,num_of_Pages,callback) => {
    let url='https://www.hackerrank.com/rest/contests/'+name+'/leaderboard/?offset='
    let num_pages=[]
    for(let i=0;i<num_of_Pages;i++)
    {
        num_pages.push(i*10)
    }
    async.concat(num_pages ,  function(offset,net)  {
         axios.get(url+offset+'&limit=10').then(result => {
            net(null,result.data.models)
        }).catch(err => {
            console.log(err)
            net(err)
        })
    } 
    ,callback
);
}