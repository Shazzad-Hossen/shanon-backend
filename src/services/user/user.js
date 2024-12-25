const { auth } = require("../middlewares");
const { createUser, login, me, signout, updateProfile, forGotPassword, verityOtp, resetPassword } = require("./user.entity");


function user(){
    //create new user
    this.route.post('/user',createUser(this));
    this.route.post('/login',login(this));
    this.route.get('/me',auth,me(this));
    this.route.get('/signout',auth,signout(this));
    this.route.patch('/user',auth,updateProfile(this));
    this.route.post('/forgot-password',forGotPassword(this));
    this.route.post('/verify-otp',verityOtp(this));
    this.route.post('/reset-password',resetPassword(this));
    
    
    


    
    


}

module.exports=user;