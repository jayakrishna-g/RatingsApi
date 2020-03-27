const express = require('express')
const config = require('./db/config')
const playerLib = require('./db/lib/player')
const bodyParser = require('body-parser')
const index = require('./index')
const db = require('./db/connect')

const app = express()

app.set('views', __dirname +'/views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.connect()

const port = config.port


app.get('/', (req, res) => res.render('home'))

app.get('/players', (req,res) => {
    playerLib.getAllPlayers(function(err,players) {
        res.json(players)
    })
})

app.post('/' , (req,res) => {
    console.log(req.body)
    try{
    index.work(req.body,(err,result) => {
        if(err)
        throw err;
        else
        res.json(result)
    })}
    catch(err)
    {
        console.log(err)
        res.send(err)
    }
})

app.post('/api/players', (req, res) => {
    playerLib.addPlayer(req.body, function (err,result) {
        console.log(JSON.stringify(result))
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))