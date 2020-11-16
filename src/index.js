const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const boatRouter = require('./routers/boat')
const liveRouter = require('./routers/live')
const equipementRouter = require('./routers/equipement')
const travailRouter = require('./routers/travail')
const tacheRouter = require('./routers/tache')
const inventaireRouter = require('./routers/inventaire')
const liquideRouter = require('./routers/liquide')
const liquideAjouteRouter = require('./routers/liquideAjoute')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter,boatRouter,liveRouter,equipementRouter,travailRouter,
    tacheRouter,inventaireRouter,liquideRouter,liquideAjouteRouter)

app.listen(port,()=>{
    console.log('server is on port '+port)
})