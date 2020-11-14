const mongoose = require('mongoose')

const equipementSchema = new mongoose.Schema({
    nom:{
        type: String,
        required: true,
        trim: true
    },
    constructeur :{
        type: String,
        required: true,
        trim: true
    },
    numero_serie:{
        type: Number,
        require : true
    },
    modele: {
        type: String,
        required: true,
        trim: true
    },
    annee:{
        type: Number,
        required:true,
        validate(value){
            if(value<1970){
                throw new Error('tapez une valeur valide !')
            }
        }
    },
    categorie:{
        type: String,
        enum:['mecanique','electrique','electronique et navigation','securite','coque','pont et greement'],
        required: true
    },
    heures_de_marche:{
        type:Number,
    },
    etat:{
        type:String,
        enum:['en marche', 'en reparation','en panne'],
        required:true
    },
    position:{
        type:String,
        trim: true
    },
    date_derniere_maintenance:{
        type:Date,
        required: true
    },
    date_prochaine_maintenance:{
         type:Date
    },
    date_fin_garantie:{
     type:Date
    },
    ship:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Boat',
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
timestamps:true})

const Equipement= new mongoose.model('Equipement',equipementSchema)

module.exports= Equipement