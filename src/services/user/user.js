const { auth } = require("../middlewares");
const { createUser, login, me } = require("./user.entity");


function user(){
    //create new user
    this.route.post('/user',createUser(this));
    this.route.post('/login',login(this));
    this.route.get('/me',auth,me(this));


    
    


}

module.exports=user;