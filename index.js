const hackerrank = require('./Hackerrank/hackerranklib')
const codechef = require('./Codechef/codechef')
const db = require('./db/lib/player')
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
      let currRating = update.update(prevRating,Leaderboard)
      console.log(prevRating)
      let i=0;
      currRating.forEach(element => {
        prevRating[i].Rating = element.Rating
        prevRating[i].Volatility = element.Volatility
        prevRating[i].TimesPlayed = element.TimesPlayed
        i+=1
      });
      console.log(prevRating)
      async.each(prevRating, (element,next)=> {
        db.updatePlayer(element , (err , res) => {
          next();
        }),
        (err) => {
          console.log(prevRating)
          callback(err,prevRating);
        }
      })
    })
  }
}
