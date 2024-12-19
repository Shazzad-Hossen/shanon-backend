const { auth } = require("../middlewares");
const { createRegion, createCity, getAllRegion, getAllCities, createArea, getAllAreas } = require("./shinningAddress.entity");


function shinningAddress(){

    // this.route.post('/region',createRegion(this));
    this.route.get('/region',getAllRegion(this));
    // this.route.post('/city',createCity(this));
    this.route.get('/city',getAllCities(this));
    // this.route.post('/area',createArea(this));
    this.route.get('/area',getAllAreas(this));
    
    
    
    

    



    
    


}

module.exports=shinningAddress;