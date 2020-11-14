const express = require('express')
const LiquideAjoute = require('../models/liquideAjoute')
const auth = require('../middleware/auth')
const Journale = require('../models/journale')
const router = new express.Router()

//create liquideAjoute
router.post('/liquides/:idl/liquideAjoutes',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const liquide = req.params.idl
    const liquideAjoute = new LiquideAjoute({
        ...req.body,
        liquide,
        owner:req.user._id
    })
    try{
     await liquideAjoute.save()
     const journale = new Journale({suser:req.suser,user:req.user._id,actionId:liquideAjoute._id,action:'ajoute liquide'})
     await journale.save()
     res.status(201).send(liquideAjoute)
    }catch(e){
     res.status(400).send(e)
    }
})


//find liquide ajoutes
router.get('/liquides/:idl/liquideAjoutes',auth,async(req,res)=>{
    const liquide = req.params.idl
    try{
        const liquideAjoutes = await LiquideAjoute.find({liquide})
        res.status(200).send(liquideAjoutes)
    } catch(e){
        res.status(500).send(e)
    }
})

//find one liquide ajoute
router.get('/liquides/:idl/liquideAjoutes/:idlaj',auth,async(req,res)=>{
    const liquide = req.params.idl
    const _id = req.params.idlaj
    try{
        const liquideAjoute = await LiquideAjoute.findOne({liquide,_id})
        res.status(200).send(liquideAjoute)
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports = router