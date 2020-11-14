const express = require ('express')
const Liquide = require('../models/liquide')
const auth = require ('../middleware/auth')
const Journale = require('../models/journale')

const router = new express.Router()

// cree liquide
router.post('/boats/:idb/liquides',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const ship = req.params.idb
    const liquide = new Liquide({
        ...req.body,
        ship,
        owner:req.user._id
    })
    try{
     await liquide.save()
     res.status(201).send(liquide)
     const journale = new Journale({suser:req.suser,user:req.user._id,actionId:liquide._id,action:'creation liquide'})
     await journale.save()
    }catch(e){
     res.status(400).send(e)
    }
})

// delete liquide
router.delete('/boats/:idb/liquides/:idl',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const ship = req.params.idb
    const _id = req.params.idl
    try{
      const liquide = await Liquide.findOneAndDelete({_id,ship})
      if(!liquide){
          return res.status(404).send({error:"not found"})
      }
      const journale = new Journale({suser:req.suser,user:req.user._id,actionId:liquide._id,action:'supprime liquide'})
     await journale.save()
      res.status(200).send(liquide)
    }catch(e){
     res.status(500).send(e)
    }
})

// find all liquides per boat
router.get('/boats/:idb/liquides',auth,async(req,res)=>{
    const ship = req.params.idb
    try{
       const liquides = await Liquide.find({ship,owner:req.user._id})
       res.send(liquides)
    } catch(e){
        res.status(500).send(e)
    }
})
// find liquide
router.get('/boats/:idb/liquides/:idl',auth,async(req,res)=>{
    const ship = req.params.idb
    const _id = req.params.idl
    try{
       const liquides = await Liquide.find({ship,_id})
       res.send(liquides)
    } catch(e){
        res.status(500).send(e)
    }
})
//update liquide
router.patch('/boats/:idb/liquides/:idl',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const ship= req.params.idb
    const _id = req.params.idl
    const updates = Object.keys(req.body)
    const validUpdates = ['categorie','discription','capacite_totale','alerte','quantite_alerte']
    const isValidUpdates = updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdates){
        return res.status(400).send({error:'invalid updates'})
    }
    try{
     const liquide = await Liquide.findOne({_id,ship})
     updates.forEach((update)=>{liquide[update]=req.body[update]})
      await liquide.save()
      const journale = new Journale({suser:req.suser,user:req.user._id,actionId:liquide._id,action:'modification liquide'})
     await journale.save()
      res.status(202).send(liquide)
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports = router