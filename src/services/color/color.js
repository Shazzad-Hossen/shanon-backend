const { checkRole, auth } = require("../middlewares");
const { createColorFamily, getAllColorFamily, deleteColorFamily, editColorFamily } = require("./color.entity");

function color (){
    this.route.post('/color',auth,checkRole(['super-admin', 'admin']),createColorFamily(this));
    this.route.get('/color',getAllColorFamily(this));
    this.route.delete('/color/:_id',auth, checkRole(['super-admin', 'admin']),deleteColorFamily(this));
    this.route.patch('/color/:_id',auth ,checkRole(['super-admin', 'admin']),editColorFamily(this));
    
    
   


}

module.exports=color;