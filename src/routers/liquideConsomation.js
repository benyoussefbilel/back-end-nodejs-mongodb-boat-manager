const express= require('express')
const LiquideConsomation = require('../models/liquideConsomation')
const Journale = require('../models/journale')

const router = new express.Router()

//add liquide consomation
router.post('/liquides/:idl/liquideConsomations',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const liquide = req.params.idl
    const liquideConsomation = new LiquideConsomation({
        ...req.body,
        liquide,
        owner:req.user._id
    })
    try{
      await liquideConsomation.save()
      const journale = new Journale({suser:req.suser,user:req.user._id,actionId:liquideConsomation._id,action:'ajoute consomation'})
     await journale.save()
      res.status(201).send(liquideConsomation)
    } catch(e){
        res.status(500).send(e)
    }
})
// find liquide Consomation
router.get('/liquides/:idl/liquideConsomations',auth,async(req,res)=>{
    const liquide = req.params.idl
    try{
      const liquideConsomations= await find({liquide})
      res.status(200).send(liquideConsomations)
    } catch(e){
        res.status(500).send(e)
    }
})
//find one liquide existant
router.get('/liquides/:idl/liquideConsomations/:idlcons',auth,async(req,res)=>{
    const liquide = req.params.idl
    const _id = req.params.idlcons
    try{
      const liquideConsomation= await find({liquide,_id})
      res.status(200).send(liquideConsomation)
    } catch(e){
        res.status(500).send(e)
    }
})



module.exports= router