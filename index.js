const hackerrank = require('./Hackerrank/hackerranklib')
const codechef = require('./Codechef/codechef')
const playerLib = require('./db/lib/player')
const async = require('async')
const config = require('./db/config')
const update = require('./updateRating')


module.exports.work = (obj,callback) => {
  console.log(obj)
  for(let k in obj)
  {
    config[k] = obj[k]
  }
  if(config.contest_site == "Codechef")
  {
    codechef.work((err,Conv_leaderboard,Ori_leaderboard) => {

      callback(err,Conv_leaderboard);
    })
  }
  else if(config.contest_site == "Hackerrank")
  {
    hackerrank.work((err,prevRating,Leaderboard) => {
      console.log(update.update(prevRating,Leaderboard))
      callback(err,prevRating);
    })
  }
}
