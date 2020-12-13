const express = require('express')
const cors = require('cors')
bodyParser = require('body-parser')
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
const imagesdocUserRouter = require('./routers/images&docUser')

const app = express()
const port = process.env.PORT
app.use(express.static('public'));
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRouter,boatRouter,liveRouter,equipementRouter,travailRouter,
    tacheRouter,inventaireRouter,liquideRouter,liquideAjouteRouter,imagesdocUserRouter)



app.listen(port,()=>{
    console.log('server is on port '+port)
})