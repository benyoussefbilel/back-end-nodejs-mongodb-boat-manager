const mongoose = require('mongoose')
const validator = require ('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')
const Boat = require('./boat')
const Live = require('./live')

const userSchema = new mongoose.Schema({
name :{
    type : String,
    required : true,
    trim : true
    },
email:{
    type : String,
    required : true,
    unique: true,
    lowercase : true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('email is invalid')
        }
    }
},
password : {
    type : String,
    required : true,
    minlength : 7

},
role: {
    type: String,
    enum : ['admin','chef atelier','technicien','proprietaire','gestionnaire','guest'],
    required: true
},
suser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
acboats:[{
    acboat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Boat',
        required:true
    },_id:false
}],
addboat:{
    type: Boolean,
    default:true
},
tokens: [{
    token : {
        type : String,
        required : true
    }
}]
},{
timestamps: true
})
userSchema.virtual('boats',{
    ref: 'Boat',
    localField: '_id',
    foreignField: 'sowner'
})
userSchema.virtual('equipements',{
    ref : 'Equipement',
    localField : '_id',
    foreignField : 'sowner'
})


// not showing the passeword and the tokens
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject

}



// generatingAuthtoken
userSchema.methods.generateAuthtoken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString()},'medisail')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// logging with password
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if (!user){
        throw new Error('unable to login') }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) {
        throw new Error('unable to login')
    }
    return user
}

//hash the password before saving
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,13)
    }
  next()
})

//delete boats and lives when user is deleted
userSchema.pre('remove', async function(next){
    const user= this
    await Boat.deleteMany({owner : user._id})
    await Live.deleteMany({userowner : user._id})
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User