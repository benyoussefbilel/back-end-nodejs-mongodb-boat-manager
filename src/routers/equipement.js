const express = require('express')
const Equipement = require('../models/equipement')
const auth = require('../middleware/auth')
const Boat = require('../models/boat')
const Journale = require('../models/journale')

const router= new express.Router()

// create equipement
router.post('/boats/:idb/equipements',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    const ship=req.params.idb
    const equipement = new Equipement({...req.body,ship,owner:req.user._id})
 try{ 
     await equipement.save()
     const journale = new Journale({suser:req.suser,user:req.user._id,actionId:equipement._id,action:'creation equipement'})
     res.status(201).send(equipement)
 } catch(e){
     res.status(500).send(e)
 }
})

// delete equipement
router.delete('/boats/:idb/equipements/:id',auth,async(req,res)=>{
     const _id=req.params.id
     if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    try{
     const equipement = await Equipement.findOneAndDelete({_id,ship:req.params.idb})
     if(!equipement){
         return res.status(404).send('not found')
     }
     const journale = new Journale({suser:req.suser,user:req.user._id,actionId:equipement._id,action:'supprime equipement'})
     await journale.save()
     res.status(200).send(equipement)
    
    } catch(e){
        res.status(501).send(e)
    }
})

//update equipement
router.patch('/boats/:idb/equipements/:id',auth,async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:'unauthorized'})
    }
 const _id = req.params.id
 const updates = Object.keys(req.body)
 const validUpdates = ["nom","constructeur","modele","annee","categorie",
 "heures_de_marche","etat","position","date_derniere_maintenance","date_fin_garantie","date_derniere_maintenance"]
 const isValedUpdates = updates.every((update)=>validUpdates.includes(update))
 if(!isValedUpdates){
     return res.status(400).send({error:'invalid uapdates'})
 }
 try{
     const equipement= await Equipement.findOne({_id,ship:req.params.idb})
     updates.forEach((update)=>{
         equipement[update]=req.body[update]
     })
     await equipement.save()
     const journale = new Journale({suser:req.suser,user:req.user._id,actionId:equipement._id,action:'modification equipement'})
     await journale.save()
     res.status(202).send(equipement)
 }catch(e){
     res.status(500).send(e)
 }
})

//find equipement
router.get('/boats/:idb/equipements/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const equipement = await Equipement.findOne({_id, ship: req.params.idb})
        if(!equipement){
            return res.status(404).send({error:'equipement not found'})
        }
        res.send(equipement)

    } catch(e){
        res.status(500).send(e)
    }
})

// find all equipements with filtre etat and categorie
router.get('/boats/:idb/equipements',auth,async(req,res)=>{
     const match={}
     
     if(req.query.categorie ){
          match.categorie=req.query.categorie
     }
     if(req.query.etat){match.etat = req.query.etat}
    try{
        const boat =await Boat.findOne({_id:req.params.idb})
        await boat.populate({
            path : 'equipements',
            match
        }).execPopulate()
        res.send(boat.equipements)
    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router