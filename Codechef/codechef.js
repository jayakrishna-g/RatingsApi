const updateRating = require('../updateRating');
const getLeaderBoard = require('./Scrapper');
const MongoClient = require('mongodb').MongoClient

const work = (dburl,url) => {

    let previousR = [];
    MongoClient.connect(dburl, { useNewUrlParser: true }, { useUnifiedTopology: true }).then((db) => {
        const ratingdb = db.db("Ratings")
        const playerc = ratingdb.collection("Player")
        playerc.find({}).toArray().then((result) => {
            previousR = result;
            console.log(previousR)
        }).catch((err) => console.log(err))
        db.close()
    }).catch((err) => console.log(err))

    let result = {};
    let reqPrevRating = [];
    let ranklist = []
    let currRating = []
    getLeaderBoard.getRanklist(result, url).then(() => {
        ranklist = result.ranklist;
        console.log(ranklist);
        ranklist.forEach(element => {
            if (!previousR.find((e) => {
                if (element.RollNumber == e.RollNumber) {
                    reqPrevRating.push({ RollNumber: e.RollNumber, Rating: e.Rating, Volatility: e.Volatility, TimesPlayed: e.TimesPlayed })
                    return true
                }
            }))
            {
                reqPrevRating.push({ RollNumber: element.RollNumber, Rating: 1500, Volatility: 125, TimesPlayed: 0 })
            }
        });
        console.log(previousR)
        currRating = updateRating.update(reqPrevRating, ranklist);
        console.log(currRating)
        MongoClient.connect(dburl, { useNewUrlParser: true }, { useUnifiedTopology: true }).then((db) => {
            const ratingdb = db.db("Ratings")
            const playerc = ratingdb.collection("Player")
            currRating.forEach(element => {
                playerc.updateOne({ RollNumber: element.RollNumber }, { $set: element }, { upsert: true })
            })
            db.close()
        }).catch((err) => console.log(err))
    })
}

module.exports = {
    work : work
}