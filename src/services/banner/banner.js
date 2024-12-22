const { auth, checkRole } = require("../middlewares");
const { createBanner, getAllBanners, deleteBanner } = require("./banner.entity");

function banner(){
    //create new banner
    this.route.post('/banner', auth, checkRole(['super-admin', 'admin']),createBanner(this));
    this.route.get('/banner', getAllBanners(this));
    this.route.delete('/banner/:_id', auth, checkRole(['super-admin', 'admin']),deleteBanner(this));




    
    


}

module.exports=banner;