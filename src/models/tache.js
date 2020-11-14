const mongoose = require('mongoose')

const tacheSchema = new mongoose.Schema({
    titre:{
        type:String,
        required:true,
        trim:true
    },
    discription:{
        type:String,
        required:true,
        trim:true
    },
    note_technicien:{
        type:String,
        trim:true
    },
    duree_estimee:{
        heures:{
            type:Number
        },
        minutes:{
            type:Number
        }
    },
    duree_reelle:{
        heures:{
            type:Number
        },
        minutes:{
            type:Number
        }
    },
    groupe:{
        type:String,
        required: true,
        trim: true
    },
    date_planification:{
        type:Date,
    },
    date_terminaison:{
        type:Date,
    },
    date_debut:{
        type:Date
    },
    active:{
     type:Boolean,
     default:true
    },
    completed:{
     type:Boolean,
     default:false
    },
    started:{
        type:Boolean,
        default:false
    },accepted:{
        type:Boolean,
        default:true
    },
    technicien:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    travail:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Travail'
    },
    ship:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Boat'
    }
},{
    timestamps: true
    })

const Tache = new mongoose.model('Tache',tacheSchema)

module.exports = Tache