const express = require('express')
const Travail = require('../models/travail')
const auth = require('../middleware/auth')
const trp = require('../middleware/travPermission')
const Tache = require('../models/tache')
const Boat = require('../models/boat')
const router = new express.Router()

//creer un travail
router.post('/boats/:idb/travaux',auth,async(req,res)=>{
    const ship = req.params.idb
    const travail = new Travail({
        ...req.body,
        ship,
        owner:req.user._id,
        sowner:req.suser
    })
    
    try{
        if(req.user.role==="technicien"||"guest"){
            return res.status(401).send({error:'unauthorized'})
        }
        await trp.travPermission(req,res)
       await travail.save()
       res.status(201).send(travail)
    } catch(e){
        res.status(400).send(e)
    }
})

// delete travail 
router.delete('/boats/:idb/travaux/:idtr',auth,async(req,res)=>{
    const _id = req.params.idtr
    const ship = req.params.idb
try{
    if(req.user.role==="technicien"||"guest"){
        return res.status(401).send({error:'unauthorized'})
    }
    await trp.travPermission(res,req)
    const travail= await Travail.findOneAndDelete({_id,ship})
    res.status(200).send(travail)
} catch(e){
    res.status(500).send(e)
}
    
})
// find travail
router.get('/boats/:idb/travaux/:idtr',auth,async(req,res)=>{
    const _id = req.params.idtr
    const ship = req.params.idb
    try{
        await trp.travPermission(res.req)
     const travail= await Travail.findOne({_id,ship})
     if (!travail){
         return res.status(404).send({error:'not found'})
     }
     res.status(200).send(travail)
    } catch(e){
        res.status(500).send(e)
    }
})

//find all travaux per boat
router.get('/boats/:idb/travaux',auth,async(req,res)=>{
    const ship = req.params.idb
    try{
        await trp.travPermission(req,res)
    const travaux = await Travail.find({ship})
    res.status(200).send(travaux)
    } catch(e){
        res.status(500).send(e)
    }
})
// find all travaux per equipement
router.get('/travaux/:ideq',auth,async(req,res)=>{
    const equipement = req.params.ideq
    try{
     const travaux= await Travail.find({equipement})
     res.status(200).send(travaux)
    } catch(e){
        res.status(500).send(e)
    }
})
// find all travaux per user
router.get('/travaux',auth,async(req,res)=>{
    const sowner = req.suser
    try{
        if(req.user.role==="admin"){
            const travaux = await Travail.find()
           return res.status(200).send(travaux)
        }
        if(req.user.role==="proprietaire" || "chef atelier") {
        const boats= await Boat.find({sowner,isArchived:false})
        const ids = boats.map((boat)=>{return boat._id})
        const travaux = await Travail.find().where('ship').in(ids).exec()
        return res.status(200).send(travaux)
    }
        if(req.user.role ==="gestionnaire" || "technicien"||"guest"){
            const acboats = req.user.acboats
            idbs = acboats.map((acboat)=>{return acboat.acboat})
            const boats= await Boat.find({isArchived:false}).where('_id').in(idbs).exec()
            const travaux = await Travail.find().where('ship').in(boats).exec()
            return res.status(200).send(travaux)
        }

       res.send()
    } catch(e){
        res.status(500).send(e)
    }
})

//update travail
router.patch('/boats/:idb/travaux/:idtr', auth,async (req,res)=>{
    const ship = req.params.idb
    const _id = req.params.idtr
    const updates = Object.keys(req.body)
    const validUpdates = ['titre','duree_estimee','duree_reelle','type_intervention','statu_urgence',
    'etat_travail','date_planification','date_terminaison','date_debut','equipement','reparateur',' date_prochain']
    const isValidUpdates = updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdates){
        return res.status(400).send({error:'invalid updates'})
    }
    try{
        if(req.user.role==="technicien"||"guest"){
            return res.status(401).send({error:'unauthorized'})
        }
        await trp.travPermission(req,res)
     const travail = await Travail.findOne({_id,ship})
     updates.forEach((update)=>{travail[update]=req.body[update]})
     await travail.save()
     res.status(202).send(travail)
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports=router