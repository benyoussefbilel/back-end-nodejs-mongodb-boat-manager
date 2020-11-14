



     const boatPermission = (req,res)=>{
         const boat = req.params.idb
         
          const acboats = req.user.acboats
          
         const ids =acboats.map((acboat)=>{return acboat.acboat})
        
        if(req.user.role === "proprietaire" || req.user.role ==="chef atelier" ||req.user.role==="admin"){
            return
        }
    
        else if(!ids.includes(boat)) {

           return res.send({error:"unauthorized"})
         }
   
     
    }

module.exports={boatPermission}