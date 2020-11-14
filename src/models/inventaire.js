const mongoose = require('mongoose')

const inventaireSchema = new mongoose.Schema({
    nom:{
        type: String,
        required:  true,
        trim: true
    },
    discription:{
        type:String,
        trim: true
    },
    position:{
        type:String,
        required: true,
        trim :true
    },
    quantite:{
        type: Number,
        required: true,
    },
    quantite_alerte:{
        type:Number,
        required: true,
    },
    alerte_stock:{
        type: Boolean,
        default:true,
        required: true,
    },
    categorie:{
        type : String,
        enum:['pieces de rechange et outils','cuisine','documents','autres','loisirs','securite','vie a bord'],
        required:true
    },
    ship:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Boat'
    },
    equipement:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Equipement'
    }
},
{
   timestamps: true
})

const Inventaire = new mongoose.model('Inventaire',inventaireSchema)

module.exports = Inventaire