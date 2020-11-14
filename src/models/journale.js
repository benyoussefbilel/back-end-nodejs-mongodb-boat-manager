const mongoose = require('mongoose')

const journaleSchema = new mongoose.Schema({
    suser:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    actionId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    action:{
        type:String,
        required:true
    }
},{timestamps:true})

const Journale = new mongoose.model('Journale',journaleSchema)

module.exports = Journale