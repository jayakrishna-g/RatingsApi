const updateRating=require('./updateRating');
const getLeaderBoard = require('./Scrapper');

const MongoClient = require('mongodb').MongoClient
const dburl = "mongodb://localhost:27017/Ratings"

let previousR=[];

MongoClient.connect(dburl).then((db)=>{
    const ratingdb = db.db("Ratings")
    const playerc = ratingdb.collection("Player")
    playerc.find({}).toArray().then((result) => {
        previousR=result;
        console.log(previousR)
    }).catch((err) => console.log(err))
    db.close()
}).catch((err) => console.log(err))

let result={};
let url = 'https://www.codechef.com/rankings/FEB20B?filterBy=Institution%3DCMR%20College%20of%20Engineering%20%26%20Technology%2C%20Hyderabad&order=asc&sortBy=rank'
let reqPrevRating = [];
let ranklist = []
let currRating = []
getLeaderBoard.getRanklist(result,url).then(() =>{
    ranklist=result.ranklist;
    console.log(ranklist);
    ranklist.forEach(element => {
        if(previousR.find((e) => element==e.RollNumber))
        {
            reqPrevRating.push(element)
        }
        else
        {
            reqPrevRating.push({ RollNumber: element, Rating: 1500, Volatility: 125, TimesPlayed: 0 })
        }
    });
    currRating=updateRating.update(reqPrevRating,ranklist);
    MongoClient.connect(dburl).then((db)=>{
        const ratingdb = db.db("Ratings")
        const playerc = ratingdb.collection("Player")
        currRating.forEach(element => {
            playerc.find({RollNumber : element.RollNumber}).toArray().then((res) => {
                if(res.length == 0)
                {
                    playerc.insertOne(element)
                    console.log("inserted")
                }
                else
                {
                    playerc.updateOne({RollNumber : element.RollNumber} , element)
                }
            }).catch((err) => console.log(err))
        })
        db.close()
    }).catch((err) => console.log(err))
})