const { auth, checkRole } = require("../middlewares");
const { dashboardStats } = require("./dashboard.entity");

function dashboard (){
    this.route.get('/dashboard', auth, checkRole(['admin','super-admin']),dashboardStats(this));
   


}

module.exports=dashboard;