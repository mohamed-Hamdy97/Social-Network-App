const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const fs = require('fs')
const cors = require('cors')

dotenv.config()
//local files
const postRoutes = require('./routes/posts')
const userAuthRoutes = require('./routes/UserAuth')
const userRoutes = require('./routes/users')

//connection to mongodb
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('db connected'); })
    .catch((e) => console.log('err' + e))


const app = express()
//middleWare
app.use(expressValidator())
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use('/', postRoutes)
app.use('/', userAuthRoutes)
app.use('/', userRoutes)
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Unauthorized...' });
    }
});

app.get('/', (req, res) => {
    fs.readFile('./Docs/APIDocs.json', (err, data) => {
        if (err) {
            return res.status(400).json({
                message: err
            })
        }
        const docs = JSON.parse(data);
        res.json(docs);
    })
})


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`this app is running on port${port}`)
})