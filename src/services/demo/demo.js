const { demoGet } = require("./demo.entity");

function demo (){
    this.route.get('/demo',demoGet(this));
   


}

module.exports=demo;