const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require('dotenv')
dotenv.config();

// 3 on use start (cors, express.json(), express.urlencoded)
app.use(cors())

// Get variable environment
const portServer = process.env.PORT_SERVER_RUNNING

// Connected on database ft mongodb
mongoose.connect(process.env.URL_MONGOOSE, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Successfully connect on database')
})
.catch((error) => {
    console.log(error)
})

// Middleware untuk mengatur timeout
app.use((req, res, next) => {
    res.setTimeout(20000, () => {
        res.status(408).send('Request timeout');
    });
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
const VerifyToken = require('./Middlewares/verifyToken')

// Routers
const accountRouter = require('./Routers/authRouter')
const VisualRouter = require('./Routers/visualRouter')
const DinasRouter = require('./Routers/dinasRouter')

app.use('/account', accountRouter)
app.use('/visual', VerifyToken, VisualRouter)
app.use('/dinas', VerifyToken, DinasRouter)
app.use('/v2/dinas', DinasRouter)
app.use('/v2/visual', VisualRouter)

app.get('/test', (req, res) => {
    res.send('test success!')   
})

// Running test
app.listen(portServer,() => {
    console.log(`Running on port ${portServer}`)
})