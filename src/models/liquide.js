const mongoose = require('mongoose')

const liquideSchema = new mongoose.Schema({
    categorie:{
        type:String,
        enum:['essence','huile','gasoil','eau douce'],
        required: true
    },
    discription:{
        type:String,
        trim:true,
        required:true
    },
    capacite_totale:{
        type:Number,
        required:true
    },
    alerte:{
        type:Boolean,
        default:true
    },
    quantite_alerte:{
        type:Number,
        required:true
    },
    ship:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Boat'
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }

},{timestamps: true}
)
const Liquide = new mongoose.model('Liquide',liquideSchema)

module.exports = Liquide
