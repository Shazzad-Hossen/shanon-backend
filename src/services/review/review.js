const { auth } = require("../middlewares");
const { getReviews } = require("./review.entity");



function review(){
    //create new user
    // this.route.post('/review',auth,createUser(this));-
    this.route.get('/review',getReviews(this));



    
    


}

module.exports=review;