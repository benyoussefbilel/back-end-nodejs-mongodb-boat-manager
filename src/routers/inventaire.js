const express = require('express')
const auth = require('../middleware/auth')
const Inventaire = require('../models/inventaire')
const Journale = require('../models/journale')

const router = new express.Router()

// create inventaire
router.post('/boats/:idb/inventaires',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const ship = req.params.idb
    const inventaire = new Inventaire({
        ...req.body,
        ship
    })
    try{
        await inventaire.save()
        res.status(201).send(inventaire)

    } catch(e){
        res.status(400).send(e)
    }
})

// delete inventaire
router.delete('/boats/:idb/inventaires/:idi',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const _id = req.params.idi
    const ship = req.params.idb
     try{
       const inventaire = await Inventaire.findOneAndDelete({_id,ship})
        if(!inventaire){
            return res.status(404).send({error:"not found"})
        }
        res.status(200).send(inventaire)
     } catch(e){
         res.status(500).send(e)
     }
})

//find inventaire
router.get('/boats/:idb/inventaires/:idi',auth,async(req,res)=>{
    const _id = req.params.idi
    const ship = req.params.idb
    try{
        const inventaire = await Inventaire.findOne({_id,ship})
        if(!inventaire){
            return res.status(404).send({error:'not found'})
        }
        res.status(200).send(inventaire)
    } catch(e){
        res.status(500).send(e)
    }

})

//find all inventaires per boat
router.get('/boats/:idb/inventaires',auth,async(req,res)=>{
    const ship = req.params.idb
    try{
    const inventaire = await Inventaire.find({ship})
    res.status(200).send(inventaire)
    } catch(e){
        res.status(500).send(e)
    }
})

//update inventaire
router.patch('/boats/:idb/inventaires/:idi',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const ship = req.params.idb
    const _id = req.params.idi
    const updates = Object.keys(req.body)
    const validUpdates = ['nom','discription','position','discription','quantite',
    'quantite_alerte','alerte_stock','categorie']
    const isValidUpdates = updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdates){
        return res.status(400).send({error:'invalid updates'})
    }
    try{
     const inventaire = await Inventaire.findOne({_id,ship})
     updates.forEach((update)=>{inventaire[update]=req.body[update]})
      await inventaire.save()
      res.status(202).send(inventaire)
    } catch(e){
        res.status().send(e)
    }

      
})

module.exports = router