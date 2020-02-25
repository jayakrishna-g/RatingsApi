const updateRating=require('./updateRating');
const getLeaderBoard = require('./Scrapper');

const MongoClient = require('mongodb').MongoClient
const dburl = "mongodb://localhost:27017/Ratings"

let previousR=[];
let playerc,ratingdb;
const db= MongoClient.connect(dburl).then((db)=>{
    ratingdb = db.db("Ratings")
    playerc = ratingdb.collection("Player")
    playerc.find({}).toArray().then((result) => {
        previousR=result;
    }).catch((err) => console.log(err))
    console.log(previousR)
    db.close()
}).catch((err) => console.log(err))

let result={};
let url='https://www.codechef.com/rankings/FEB20B?filterBy=Institution%3DCMR%20College%20of%20Engineering%20%26%20Technology%2C%20Hyderabad&order=asc&sortBy=rank'
let reqPrevRating=[];
let ranklist=[]
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
    let currRating=updateRating.update(reqPrevRating,ranklist);
    console.log(currRating)
});
