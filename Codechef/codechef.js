const updateRating = require('../updateRating');
const getLeaderBoard = require('./Scrapper');
const MongoClient = require('mongodb').MongoClient

const work = async (dburl,url) => {

    let previousR = [];
    
    let ranklist = []
    let result = {};
    result = await getLeaderBoard.getRanklist(result,url,[1,2,3]);
    console.log(result);
}

module.exports = {
    work : work
}