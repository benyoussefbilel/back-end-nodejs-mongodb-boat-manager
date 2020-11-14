const mongoose = require('mongoose')

const liveSchema = mongoose.Schema({
  live:{
    vitesse :{
    type: Number
},
position : {
    type : String
},
statu : {
    type : String
},
date : {
    type : String
}},

ship: {
  type: mongoose.Schema.Types.ObjectId,
  required : true,
  ref : 'Boat',
},
userowner:{
  type : mongoose.Schema.Types.ObjectId,
  required: true,
  ref : 'User'
}
},
{
  timestamps : true
})

const Live = new mongoose.model('Live',liveSchema)

module.exports = Live