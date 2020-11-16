const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Journale= require('../models/journale')
const multer = require ('multer')
const sharp = require('sharp')
const router = new express.Router()

// add admin
router.post('/users', async (req,res)=>{
    if(req.body.role!=="admin"){
        return res.send({error:"invalid operation"})
    }
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthtoken()
        res.status(201).send({user,token})
    } catch (e){
        res.status(400).send(e)
    }

})
// add proprietaire or chef atelier
router.post('/users/susers',auth, async(req,res)=>{
    if(req.user.role !== 'admin'){
        return res.send({error:"invalid operation"})
    }
    if(req.body.role !=="chef atelier" & req.body.role!=="proprietaire"){
        return res.send({error:"invalid operation"})
    }
  const user = new User({...req.body})
  try{
   await user.save()
   const journale= new Journale({suser:req.suser,user:req.user._id,actionId:user._id,action:'add '+user.role})
   await journale.save()
   res.status(201).send({user})
  } catch(e){
   res.status(400).send(e)
  }
})


//add gestionaire
router.post('/users/gestionaires',auth, async(req,res)=>{
    if(req.body.role!=="gestionnaire" || req.user.role!=="proprietaire" ){
        return res.send({error:"invalid operation"})
    }
  const gestionaire = new User({...req.body,suser:req.user._id})
  try{
   await gestionaire.save()
   const journale= new Journale({suser:req.suser,user:req.user._id,actionId:gestionaire._id,action:'add '+gestionaire.role})
   await journale.save()
   res.status(201).send(gestionaire)
  } catch(e){
   res.status(400).send(e)
  }
})
//add technicien
router.post('/users/techniciens',auth, async(req,res)=>{
    if(req.body.role!=="technicien" || req.user.role!=="chef atelier" ){
        return res.send({error:"invalid operation"})
    }
  const technicien = new User({...req.body,suser:req.user._id})
  try{
   await technicien.save()
   const journale= new Journale({suser:req.suser,user:req.user._id,actionId:technicien._id,action:'add '+technicien.role})
   await journale.save()
   res.status(201).send(technicien)
  } catch(e){
   res.status(400).send(e)
  }
})
// login 
router.post('/users/login', async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthtoken()
        res.send({user,token})
        
    } catch(e){
        res.status(400).send(e)
        console.log(e)
    }

})
// my profil
router.get('/users/me', auth, async (req,res)=>{
   try{
       res.send(req.user)
   } catch(e){
       res.status(500).send(e)
   }
})

//update user
router.patch('/users/me',auth, async(req,res)=>{
    if(req.user.role==="guest"){
        return res.status(401).send({error:"invalid operation"})
    }
    const updates = Object.keys(req.body)
    const validUpdates = ['name','email','password']
    const isValidUpdate = updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({error:'invalid updates'})
    }
    try{
        updates.forEach((update)=> req.user[update]= req.body[update])
        await req.user.save()
        const journale= new Journale({suser:req.suser,user:req.user._id,actionId:req.user._id,action:'modification user'})
        await journale.save()
        res.send(req.user)

    } catch(e){
        res.status(400).send(e)
    }
})

// logout
router.post('/users/logout',auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send('logged out')
    } catch(e){
        res.status(500).send(e)
        console.log(e)
    }
})

// logout all devices
router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
    req.user.tokens= []
    await req.user.save()
    res.send('logged out')
 } catch(e){
     res.status(400).send(e)
 }
})
// delete user 
router.delete('/users/me', auth, async(req,res)=>{
    try{
      await req.user.remove()
      const journale= new Journale({suser:req.suser,user:req.user._id,actionId:req.user._id,action:'supprime user'})
   await journale.save()
      res.send(req.user)
    } catch(e){
      res.send(e)
    }
})

//find subusers...
router.get('/users',auth,async(req,res)=>{
       const role = req.user.role
       const { page = 1, limit = 10 } = req.query
    try{
    if(role==='admin'){
        const users = await User.find().limit(limit*1).skip((page -1)*limit).sort({createdAt:-1}).exec()
        const count = await User.countDocuments();
       return res.status(200).send({users,totalPages: Math.ceil(count / limit),
        currentPage: page})
    }
    else if(role === 'proprietaire' || role === 'chef atelier'){
        const users = await User.find({suser : req.user._id}).limit(limit*1).skip((page -1)*limit).sort({createdAt:-1}).exec()
        const count = await User.countDocuments();
       return res.status(200).send({users,totalPages: Math.ceil(count / limit),
        currentPage: page})
    }
    res.status(200).send({error:'no access'})
    } catch(e){
        res.status(500).send(e.message)
    }
})

//find one subuser
router.get('/users/:idu',auth,async(req,res)=>{
    const role = req.user.role
    const _id = req.params.idu
    try{
        if(role==='admin'){
            const user = await User.findOne({_id})
           return res.status(200).send(user)
        }
        else if(role === 'proprietaire' || role === 'chef atelier'){
            const user = await User.findOne({suser : req.user._id,_id})
            return res.status(200).send(user)
        }
        res.status(200).send({error:'no access'})
    }catch(e){
      res.status(500).send(e)
    }
})

//delete one subuser...
router.delete('/users/:idu',auth,async(req,res)=>{
    const role = req.user.role
    const _id = req.params.idu
    try{
        if(role==='admin'){
            const user = await User.findOneAndDelete({_id})
            
           return res.status(200).send(user)
        }
        else if(role === 'proprietaire' || role === 'chef atelier'){
            const user = await User.findOneAndDelete({suser : req.user._id,_id})
            const journale= new Journale({suser:req.suser,user:req.user._id,actionId:user._id,action:'supprime '+user.role})
            await journale.save()
            return res.status(200).send(user)
        }
        res.status(200).send({error:'no access'})
    }catch(e){
      res.status(500).send(e)
    }
})
//update subuser...
router.patch('/users/:idu',auth,async(req,res)=>{
    const role = req.user.role
    const _id = req.params.idu
    const updates = Object.keys(req.body)
    const validUpdates = ['name','email','password','acboats','addboat']
    const isValidUpdate = updates.every((update)=>validUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({error:'invalid updates'})
    }
    try{
        if(role==='admin'){
            const user = await User.findOne({_id})
            updates.forEach((update)=> user[update]= req.body[update])
            await user.save()
           return res.status(200).send(user)
        }
        else if(role === 'proprietaire' || role === 'chef atelier'){
            const user = await User.findOne({suser : req.user._id,_id})
            updates.forEach((update)=> user[update]= req.body[update])
            await user.save()
            const journale= new Journale({suser:req.suser,user:req.user._id,actionId:user._id,action:'modification '+user.role})
            await journale.save()
            return res.status(200).send(user)
        }
        res.status(200).send({error:'no access'})
    }catch(e){
      res.status(500).send(e)
    }
})

// multer middleware for image avatar
const uploadavatar = multer({
    limits:{
        fieldSize:10000000
    },
    fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('please upload an image'))
    }
    cb(undefined,true)
    }
})

//adding and changing image to the user
router.post('/users/me/avatar', auth, uploadavatar.single('avatar') ,async(req,res)=>{
    const buffer = await sharp(req.file.buffer).png().resize({width:250,height:250}).toBuffer() 
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
 res.status(400).send({error:error.message})
})

// deleting image from the user profile
router.delete('/users/me/avatar',auth ,async(req,res)=>{
 req.user.avatar = undefined
 await req.user.save()
 res.send()
})

// fetching the user image 
router.get('/users/:idu/avatar', auth, async(req,res)=>{
    try{
     const user = await User.findById(req.params.idu)
      if (!user || !user.avatar){
          throw new Error({error:'not found'})
      }
      res.set('Content-Type','image/png')
      res.send(user.avatar)
    } catch(e){
    res.status(404).send()
    }
})

module.exports = router