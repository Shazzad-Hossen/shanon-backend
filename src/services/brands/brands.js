const { auth, checkRole } = require("../middlewares");
const { addBrandLogo, getBrandImages, deleteBrandImage } = require("./brands.entity");


function brand (){
    this.route.post('/brand', auth, checkRole(['super-admin']), addBrandLogo(this));
    this.route.get('/brand', getBrandImages(this));
    this.route.delete('/brand/:_id', auth, checkRole(['super-admin']), deleteBrandImage(this));
    
    

}

module.exports=brand;