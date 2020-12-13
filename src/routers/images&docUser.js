const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Journale= require('../models/journale')
const multer = require ('multer')
const sharp = require('sharp')
const path = require ('path')

const router = new express.Router()

//ta5riiif zayed
// const pathhandlerforfront=(req)=>{
//   const directories = req.file.path.toString().split('\\public')
//   const url = directories[1]
//   console.log(url)
//   const avatar=`http://localhost:${process.env.PORT}`.concat(url)
//   console.log('fromfunction ',avatar)
//   var avatar2 = avatar.toString().replace(/\\/g, '/')
//   return avatar2
// }


// multer middleware for image avatar

    
const fileFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('please upload an image'))
    }
    cb(undefined,true)
    }


const storagepath = path.join(__dirname,'../../public/images')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,storagepath)
  },
  filename: function (req, file, cb) {
    cb(null,  file.originalname)
  }
})

const upload = multer({ storage: storage,fileFilter:fileFilter,limits:{fileSize:10000000}})

//adding and changing image to the user

router.post('/users/me/avatar', auth, upload.single('avatar') ,async(req,res)=>{
 
  
 
  req.user.avatar=`http://localhost:${process.env.PORT}/images/`+req.file.originalname
    await req.user.save()
    res.status(201).send('done')
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
module.exports=router