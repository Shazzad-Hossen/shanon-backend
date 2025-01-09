const { auth, checkRole } = require("../middlewares");
const { createUser, login, me, signout, updateProfile, forGotPassword, verityOtp, resetPassword, getAllUsers, userStats, createAdmin, updateAdminAccess, deleteUser, tempdeleteUser } = require("./user.entity");


function user(){
    //create new user
    this.route.post('/user',createUser(this));
    this.route.post('/user/create-admin',auth, checkRole(['super-admin']),createAdmin(this));
    this.route.post('/login',login(this));
    this.route.get('/me',auth,me(this));
    this.route.get('/signout',auth,signout(this));
    this.route.patch('/user',auth,updateProfile(this));
    this.route.patch('/user/update-access',auth, checkRole(['super-admin']),updateAdminAccess(this));
    this.route.post('/forgot-password',forGotPassword(this));
    this.route.post('/verify-otp',verityOtp(this));
    this.route.post('/reset-password',resetPassword(this));
    this.route.get('/users',getAllUsers(this));
    this.route.get('/user-stats/:_id', auth, userStats(this));
    this.route.delete('/user/:_id', auth, deleteUser(this));
    this.route.post('/delete-user/', tempdeleteUser(this));
    
    
    
    
    
    


    
    


}

module.exports=user;