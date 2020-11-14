const express =require('express')
const Tache = require('../models/tache')
const auth = require('../middleware/auth')
const router = new express.Router()
// creer une tache
router.post('/boats/:idb/travaux/:idtr/taches',auth,async(req,res)=>{
   const travail = req.params.idtr
   const ship = req.params.idb
   const tache = new Tache({
       ...req.body,
          travail,
          ship
   })
   try{
       await tache.save()
       res.status(201).send(tache)
   } catch(e){
       res.status(400).send(e)
   }
})

//delete tache
router.delete('/travaux/:idtr/taches/:idt',auth, async(req,res)=>{
    const _id = req.params.idt
    const travail = req.params.idtr
    try{
      const tache = await Tache.findOneAndDelete({_id,travail})
      res.status(200).send(tache)
    } catch(e){
        res.status(501).send(e)
    }
})

//find tache
router.get('/travaux/:idtr/taches/:idt',auth,async(req,res)=>{
    const _id = req.params.idt
    const travail = req.params.idtr
    try{
       const tache = await Tache.findOne({_id,travail})
       if(!tache){
           return res.status(404).send({error:'not found'})
       }
       res.status(200).send(tache)
    } catch(e){
        res.status(500).send(e)
    }
})

//find all taches per travail
router.get('/travaux/:idtr/taches',auth,async(req,res)=>{
    const travail = req.params.idtr
    try{
      const taches = await Tache.find({travail})
      res.status(200).send(taches)
    } catch(e){
        res.status(500).send(e)
    }
})
//find all my taches pour technicien
router.get('/travaux/taches',auth,async(req,res)=>{
    try{
        if(req.user.role==="technicien"){
        const taches = await Tache.find({technicien:req.user._id})
         return res.status(200).send(taches)
        }
       res.send()
    } catch(e){
        res.status(500).send(e)
    }
})
// find all taches par bateau pour technicien
//...

// find all taches per technicien
router.get('/travaux/taches/:idtec',auth,async(req,res)=>{
     
    try{
        if(req.user.role==="chef atelier"){
        const taches = await Tache.find({technicien:req.user._id})
         return res.status(200).send(taches)
        }
       res.send()
    } catch(e){
        res.status(500).send(e)
    }
})

//update tache
router.patch('/travaux/:idtr/taches/:idt',auth,async(req,res)=>{
    const travail = req.params.idtr
    const _id = req.params.idt
    const updates = Object.keys(req.body)
    const validUpdates = ['titre','duree_estimee','duree_reelle','discription','note_technicien',
    'groupe','date_planification','date_terminaison','date_debut','completed',' active','started','accepted','technicien']
    const isValidUpdates = updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdates){
        return res.status(400).send({error:'invalid updates'})
    }
    try{
        if(req.user.role === "guest"){
            return res.status(401).send({error:"unauthorized"})
        }
     const tache = await Tache.findOne({_id,travail})
     updates.forEach((update)=>{tache[update]=req.body[update]})
      await tache.save()
      res.status(202).send(tache)
    } catch(e){
        res.status(500).send(e)
    }
})
module.exports = router