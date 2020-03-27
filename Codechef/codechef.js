const Scrapper = require('./Scrapper');
const async = require('async')
const config = require('../db/config')
const db = require('../db/lib/player')

module.exports.work = (callback) => {
    let pages = []
    let url = config.leaderboardurl
    let num_pages = config.no_pages
    for(let i=1;i<=num_pages;i++) pages.push(i)
    Scrapper.getLeaderBoard(url,pages,(err,leaderboard) => {
        if(err)
        callback(err,[],leaderboard)
        let prank=0,crank=0;
        console.log(leaderboard)
        async.concat(leaderboard, (player, next) => {
            db.getSinglePlayerDetails({CodechefHandle : player.CodechefHandle}, (err, result) => {
                if(result)
                next(err,[result])
                else
                next(err,[])
            })
        },
            (err,res) => {
                console.log(res)
                res.forEach(element => {
                    if(element.Rank != prank)
                    {
                        prank = element.Rank;
                        crank+=1;
                    }
                    element.Rank=crank
                });
                callback(err,res,leaderboard)
            }
        )
    })
}
