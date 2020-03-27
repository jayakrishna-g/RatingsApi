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
            db.getSinglePlayerDetails({HackerrankHandle : player.hacker}, (err, result) => {
                if(result)
                next(err,[result])
                else
                {
                    db.addPlayer({RollNumber : player.hacker,HackerrankHandle : player.hacker , Rating : 1500 , Volatility : 125 , TimesPlayed : 0} , (err, resp) => {
                        next(err,[resp])
                    });
                }
            })
        },
            (err,res) => {
                let rank = []
                leaderboard.forEach(element => {
                    rank.push({Name : element.hacker , Rank : element.rank})
                });
                callback(err,res,rank)
            }
        )
    })
}