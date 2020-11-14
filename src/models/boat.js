const mongoose = require('mongoose')
const mongooseArchive= require('mongoose-archive')

const boatSchema = new mongoose.Schema({
    nom : {
      type : String,
      required : true,
      trim: true
    },
    pavillion:{
      type : String,
      required : true,
      trim : true
    },type: {

    },
    longueur :{
        type : Number,
        required : true,
        validate(value){
         if(value<0 & value>100){
             throw new Error('longueur unvalide')
         }
        }
    },
    largeur:{
      type : Number,
      required : true,
      validate(value){
          if(value<0 & value >35){
              throw new Error('largeur unvalide')
          }
      }
    },
    tirant_eau:{
        type : Number,
        required : true,
        validate(value){
            if(value<0 & value >10){
                throw new Error('largeur unvalide')
            }
        }
    },
    port_attache:{
       type : String,
       required : true
    },
    isArchived:{
        type:Boolean,
        default:false
    },
    sowner:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
},{
  timestamps : true
}
)
boatSchema.virtual('equipements',{
    ref : 'Equipement',
    localField : '_id',
    foreignField : 'ship'
})
boatSchema.virtual('inventaires',{
    ref : 'Inventaire',
    localField : '_id',
    foreignField : 'ship'
})
// delete lives when boat is deleted
boatSchema.pre('remove', async function(next){
    const boat = this
   
    next()
})
boatSchema.plugin(mongooseArchive)
const Boat = new mongoose.model('Boat',boatSchema)

/*instance.archive();
// instance will not be queriable with Model.find(), unless you will be querying
// archived documents by specifying proper archivedAt filter
instance.restore();
// now the document was "restored" from archive
 
// to query archived documents simply add { archivedAt: { $exists: true } } to your query
Model.find().where('archivedAt').exists(); */

module.exports = Boat