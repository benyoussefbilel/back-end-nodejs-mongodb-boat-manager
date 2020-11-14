const mongoose = require('mongoose')

const liquideExistantSchema = new mongoose.Schema({
  quantite_existante:{
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
  }

},{timestamps:true})

const LiquideExistant = new mongoose.model('LiquideExistant',liquideExistantSchema)

module.exports= LiquideExistant