const Scrapper = require('./Scrapper');
const db = require('../db/lib/player')
const async = require('async')
const config = require('../db/config')


module.exports.work = function (callback) {
    console.log(config)
    let arr = config.leaderboardurl.split('/')
    // console.log(arr)
    let name = arr[4];
    let num_pages = config.no_pages;
    Scrapper.getLeaderBoard(name, num_pages, (err, leaderboard) => {
        console.log(leaderboard)
        async.concat(leaderboard, (player, next) => {
            console.log(player)
            db.getSinglePlayerDetails({HackerrankHandle : player.hacker}, (err, result) => {
                if(result)
                next(err,[result])
                else
                next(err,[])
            })
        },
            (err,result) => {
                console.log(res)
                res.forEach(element => {
                    if(element.Rank != prank)
                    {
                        prank = element.Rank;
                        crank+=1;
                    }
                    element.Rank=crank
                });
                callback(err,result,leaderboard)
            }
        )
    })
}