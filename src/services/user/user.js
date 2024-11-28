const { createUser, login } = require("./user.entity");


function user(){
    //create new user
    this.route.post('/user',createUser(this));
    this.route.post('/login',login(this));
  

    
    


}

module.exports=user;