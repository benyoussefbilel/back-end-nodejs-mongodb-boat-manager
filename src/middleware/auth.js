const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next)=> {
    try{
     const token = req.header('Authorization').replace('Bearer ','')
     const decoded = jwt.verify(token,'medisail')
     const user = await User.findOne({_id: decoded._id , 'tokens.token': token})
     if(!user){
         throw new Error('not found')
     }
     if (!user.suser){
         req.suser=user._id
     }else{req.suser=user.suser}
     
     req.user = user
     req.token = token
     next()
    } catch(e) {
        res.status(401).send({error: 'please login!'})
    }
   }

    module.exports = auth
