// const Boat = require('../models/boat')

// const travPermission = async(req,res)=>{
//     const boat = req.params.idb
    
//      const acboats = req.user.acboats
     
//     const ids =acboats.map((acboat)=>{return acboat.acboat})
//     const ship = await Boat.findOne({_id:boat})
//    if(ship.isArchived=true){
//        return res.status(404).send({error:'boat was deleted'})
//    }
//    if(req.user.role === "proprietaire" || req.user.role ==="chef atelier" ||req.user.role==="admin"){
//        return
//    }

//    else if(!ids.includes(boat)) {

//       return res.send({error:"unauthorized"})
//     }
// }

// module.exports= {travPermission}