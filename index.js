const express = require('express')
require('./src/db/mongoose')
const userRouter = require('./src/routers/user')
const boatRouter = require('./src/routers/boat')
const liveRouter = require('./src/routers/live')
const equipementRouter = require('./src/routers/equipement')
const travailRouter = require('./src/routers/travail')
const tacheRouter = require('./src/routers/tache')
const inventaireRouter = require('./src/routers/inventaire')
const liquideRouter = require('./src/routers/liquide')
const liquideAjouteRouter = require('./src/routers/liquideAjoute')

const app = express()
const port = process.env.PORT|| 3000

app.use(express.json())
app.use(userRouter,boatRouter,liveRouter,equipementRouter,travailRouter,
    tacheRouter,inventaireRouter,liquideRouter,liquideAjouteRouter)

app.listen(port,()=>{
    console.log('server is on port '+port)
})