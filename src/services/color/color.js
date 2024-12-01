const { createColorFamily, getAllColorFamily, deleteColorFamily, editColorFamily } = require("./color.entity");

function color (){
    this.route.post('/color',createColorFamily(this));
    this.route.get('/color',getAllColorFamily(this));
    this.route.delete('/color/:_id',deleteColorFamily(this));
    this.route.patch('/color/:_id',editColorFamily(this));
    
    
   


}

module.exports=color;