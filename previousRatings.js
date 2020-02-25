const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/Ratings"


const getRating =  function (rollNumber, playerc) {
    var ret = { RollNumber: 0, Rating: 0, Volatility: 0, TimesPlayed: 0 }
    playerc.find(rno).toArray().then((result) => {
        //console.log(result)
        if (result.length != 0) {
            ret = result[0]
            console.log(ret)
        }
        else {
            let pobj = { RollNumber: rollNumber, Rating: 1500, Volatility: 125, TimesPlayed: 0 }
            playerc.insertOne(pobj)
            ret = pobj
        }
        db.close()
    }).catch((err) => console.log(err))
    console.log(ret)
    return ret
}

const prev = function (players, playerc) {
    let ret = []
    players.forEach(element => {
        ret.push(getRating(element, playerc))
    })
    return ret
}
module.exports = {
    getRating: prev

}