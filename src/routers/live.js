const express = require('express')
const auth = require('../middleware/auth')
const Live = require('../models/live')

const router = new express.Router()

// comming live 
router.post('/lives/:id', auth , async (req,res)=>{
    const _id = req.params.id
    try{
       
        const live = new Live({
            ...req.body,
            ship: _id,
            userowner : req.user._id
        })
        await live.save()
        res.send(live)
      
  } catch (e){
      res.status(400).send(e)
  }
})

// show last boat live
router.get('/lives/:id', auth, async (req,res)=>{
    const _id= req.params.id
    try{
        const lives = await Live.find({userowner : req.user._id, ship:_id}).sort({createdAt:-1}).limit(1)
        if(!lives){
            return res.status(404).send()}
        res.send(lives)
    } catch(e){
        res.status(400).send(e)
    }
})


module.exports= router