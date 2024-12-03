const { auth, checkRole } = require("../middlewares");
const { addProduct, getAllProducts } = require("./product.entity");

function product (){
    this.route.post('/product',auth, checkRole(['super-admin']),addProduct(this));
    this.route.get('/product', getAllProducts(this));
   


}

module.exports=product;