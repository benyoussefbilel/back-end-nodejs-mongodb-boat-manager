const mongoose = require('mongoose')

const liquideConsommationSchema = new mongoose.Schema({
  consommation:{
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

const LiquideConsommation = new mongoose.model('LiquideConsommation',liquideConsommationSchema)

module.exports= LiquideConsommation