const moongoose = require('mongoose')

var playerschema = new moongoose.Schema({
    RollNumber : String,
    Rating: Number,
    Volatility: Number,
    TimesPlayed: Number,
    HackerrankHandle : String,
    CodechefHandle : String,
    CodeforcesHandle : String ,
    Deleted : Boolean
});

module.exports = moongoose.model('player',playerschema)