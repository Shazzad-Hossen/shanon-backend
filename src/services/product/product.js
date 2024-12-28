const { auth, checkRole } = require("../middlewares");
const { addProduct, getAllProducts, removeProduct, getSingleProduct, searchProducts, updateProduct } = require("./product.entity");

function product (){
    this.route.post('/product',auth, checkRole(['super-admin']),addProduct(this));
    this.route.get('/product', getAllProducts(this));
    this.route.get('/product/search', searchProducts(this));
    this.route.get('/product/:_id', getSingleProduct(this));
    this.route.delete('/product/:_id',auth, checkRole(['super-admin']), removeProduct(this));
    this.route.patch('/product/',auth, checkRole(['super-admin','admin']), updateProduct(this));
    
   


}

module.exports=product;