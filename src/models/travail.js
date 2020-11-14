const mongoose =require('mongoose')

travailSchema = new mongoose.Schema({
    titre:{
        type: String,
        required: true,
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
    type_intervention:{
        type:String,
        enum:['preventive','corrective','verification','depannage','installation','autre'],
        required:true
    },
    statu_urgence:{
        type:String,
        enum:['faible','normale','eleve','urgent','immediat'],
        default:'normale',
    },
    etat_travail:{
        type: String,
        enum:['cree','planifie','en attente','en cours','termine'],
        default:'cree'
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
    date_prochain:{
        type:Date
    },
    equipement:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Equipement'
    },
    ship:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Boat'
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    sowner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    reparateur:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
},{
    timestamps: true
    })


const Travail = new mongoose.model('Travail',travailSchema)

module.exports = Travail