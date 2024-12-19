const { auth, checkRole } = require("../middlewares");
const { createOrder, getAllOrders, getSingleOrder, changeOrderStatus } = require("./order.entity");

function order (){
    this.route.post('/order',auth,createOrder(this));
    this.route.get('/order',auth, getAllOrders(this));
    this.route.get('/order/:_id',auth, getSingleOrder(this));
    this.route.patch('/order/',auth,checkRole(['admin','super-admin']), changeOrderStatus(this));
    
    
    

   


}

module.exports=order;