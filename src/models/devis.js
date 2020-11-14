const mongoose = require('mongoose')

const devisSchema = new mongoose.Schema({
    sender:{
        type:String,
        required:true,
    },
    reciever:{
        type:String,
        required:true
    },
    titre:{
        type:String,
        required:true
    },
    numDevis:{
        type:Number,
        required:true
    },
    sujet:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Travail'
    },
    montantHt:{
        type:Number,
        required:true
    },
    taxe:{
        type:Number,
        required:true
    },
    montantTotale:{
        type:Number,
        required:true
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
    payment:{
        type:Boolean,
        default:false
    },
    envoye:{
        type:Boolean,
        default:true
    }
})

const Devis = new mongoose.model('Devis',devisSchema)

module.exports=Devis