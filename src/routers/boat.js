const express = require ('express')
const Boat = require('../models/boat')
const auth = require('../middleware/auth')
const bp = require('../middleware/boatPermission')
const Journale = require('../models/journale')

const router = new express.Router()

// create boats
router.post('/boats',auth, async (req,res)=>{
    if(req.user.role==="technicien" || req.user.addboat===false || req.user.role==="guest"){
        return res.send({error:"access denied"})
    }
    const boat = new Boat({
        ...req.body,
        owner : req.user._id,
        sowner:req.suser
    })
    try{
        await boat.save()
         req.user.acboats=req.user.acboats.concat({acboat:boat._id})
         await req.user.save()
         const journale = new Journale({suser:req.suser,user:req.user._id,actionId:boat._id,action:'creation boat'})
         await journale.save()
        res.status(201).send({boat})
    } catch(e){
       res.status(400).send(e)
    }
})

// delete boat
router.delete('/boats/:idb',auth, async (req,res)=>{
    if(req.user._id!==req.suser&req.user.role!=="admin"){
        return res.status(401).send({error:"no permission"})
    }
    const _id = req.params.idb
    try{
    const boat = await Boat.findOne({_id,isArchived:false})
          boat.isArchived=true
          await boat.save()
     if(!boat){
         return res.status(404).send('not found')
     }
     const journale = new Journale({suser:req.suser,user:req.user._id,actionId:boat._id,action:'supprime boat'})
         await journale.save()
     res.status(200).send(boat)
    } catch(e){
        res.status(501).send(e)
    }
})
// update boat 
router.patch('/boats/:idb',auth, async(req,res)=>{
    const updates = Object.keys(req.body)
    const validUpdates = ['nom','pavillion','longueur','largeur','tirant_eau','port_attache','sowner','isArchived']
    const _id = req.params.idb
    const isValidUpdates = updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdates){
        return res.status(400).send({error:'invalid updates'})
    }
 try{
    bp.boatPermission(req,res)
    const boat = await Boat.findOne({_id,sowner:req.suser,isArchived:false})
    if(!boat){
       return res.status(404).send()
    }
    updates.forEach((update)=> boat[update]= req.body[update] )
    await boat.save()
    const journale = new Journale({suser:req.suser,user:req.user._id,actionId:boat._id,action:'modification boat'})
         await journale.save()
    res.status(202).send(boat)
 } catch(e){
     res.status(500).send(e)
 }

})

// find all boats
router.get('/boats', auth,async(req,res)=>{
    const sowner =req.suser
    const { page = 1, limit = 10 } = req.query
    try{
     if(req.user.role==="admin"){
         const boats= await Boat.find().limit(limit*1).skip((page -1)*limit).sort({createdAt:-1}).exec()
         const count = await Boat.countDocuments();
        return res.status(200).send({boats,totalPages: Math.ceil(count / limit),currentPage: page})
     }
      else if(req.user.role==="gestionnaire" || req.user.role==="technicien"||req.user.role==="guest"){
         
          const acboats=req.user.acboats
          const ids =acboats.map((id)=>{return id.acboat})
          const boats = await Boat.find({isArchived:false}).where('_id').in(ids).exec()
          return res.status(200).send(boats)
      }
       const boats = await Boat.find({sowner,isArchived:false})
       res.send(boats)
    }catch(e){
        res.status(401).send(e.message)
    }
})

//find one boat
router.get('/boats/:idb' ,auth, async(req,res)=>{
    const _id = req.params.idb
     
    try{
       await bp.boatPermission(req,res)
        if(req.user.role==="admin"){
            const boat = await Boat.findOne({_id})
            return 
        }
        const boat = await Boat.findOne({ _id ,isArchived:false})
        if(!boat){
            return res.status(404).send({error:'n'})
        }
        res.send(boat)
      
    } catch(e){
       res.status(500).send(e)
    }
})

module.exports = router