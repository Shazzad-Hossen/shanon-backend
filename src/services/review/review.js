const { auth } = require("../middlewares");
const { getReviews, createReview, getOrderReviews } = require("./review.entity");



function review(){
    this.route.post('/review',auth, createReview(this));
    this.route.get('/review',getReviews(this));
    this.route.get('/review/:orderId',auth,getOrderReviews(this));
    
    



    
    


}

module.exports=review;