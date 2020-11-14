const mongoose = require('mongoose')

const commandeSchema = new mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    reciever:{
        type:String,
        required:true
    },
    titre:{
        type:String,
        required:true
    },
    numCommande:{
        type:Number,
        required:true
    },
    sujet:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    qte:{
        type:Number
    },
    ship:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Boat'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    suser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    envoye:{
        type:Boolean,
        default:false
    }
})

const Commande = new mongoose.model('Commande',commandeSchema)
module.exports=Commande