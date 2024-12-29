const { auth, checkRole } = require("../middlewares");
const { addToCart, getCart, removeFromCart, emptyCart } = require("./cart.entity");


function cart(){
    this.route.post('/cart', auth, addToCart(this));
    this.route.get('/cart', auth, getCart(this));
    this.route.patch('/cart', auth, removeFromCart(this));
    this.route.delete('/cart', auth, emptyCart(this));





    
    


}

module.exports=cart;