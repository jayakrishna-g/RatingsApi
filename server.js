const express = require('express')
const app = express()
const config = require('./db/config')
const db = require('./db/connect')

db.connect()
const port = config.port

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))