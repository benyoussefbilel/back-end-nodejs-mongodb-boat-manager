const mongoose = require('mongoose')

const liquideAjouteSchema = new mongoose.Schema({
  quantite_ajoute:{
    type:Number,
    required:true
  },
  date:{
      type:Date,
      required: true
  },
  liquide:{
      type:mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'Liquide'
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  }

},{timestamps:true})

const LiquideAjoute = new mongoose.model('LiquideAjoute',liquideAjouteSchema)

module.exports= LiquideAjoute