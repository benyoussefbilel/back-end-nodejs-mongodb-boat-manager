const express= require('express')
const LiquideExistant = require('../models/liquideExistant')
const Journale = require('../models/journale')

const router = new express.Router()

//add liquide existant
router.post('/liquides/:idl/liquideExistants',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const liquide = req.params.idl
    const liquideExistant = new LiquideExistant({
        ...req.body,
        liquide,
        owner:req.user._id
    })
    try{
      await liquideExistant.save()
      const journale = new Journale({suser:req.suser,user:req.user._id,actionId:liquideExistant._id,action:'ajoute liquideExistant'})
     await journale.save()
      res.status(201).send(liquideExistant)
    } catch(e){
        res.status(500).send(e)
    }
})
// find liquides existants
router.get('/liquides/:idl/liquideExistants',auth,async(req,res)=>{
    const liquide = req.params.idl
    try{
      const liquideExistants= await find({liquide})
      res.status(200).send(liquideExistants)
    } catch(e){
        res.status(500).send(e)
    }
})
//find one liquide existant
router.get('/liquides/:idl/liquideExistants/:idlex',auth,async(req,res)=>{
    const liquide = req.params.idl
    const _id = req.params.idlex
    try{
      const liquideExistant= await find({liquide,_id})
      res.status(200).send(liquideExistant)
    } catch(e){
        res.status(500).send(e)
    }
})



module.exports= router