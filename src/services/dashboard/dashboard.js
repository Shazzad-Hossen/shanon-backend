const { auth, checkRole } = require("../middlewares");
const { dashboardStats, getOrderGraph } = require("./dashboard.entity");

function dashboard (){
    this.route.get('/dashboard', auth, checkRole(['admin','super-admin']),dashboardStats(this));
    this.route.get('/dashboard/order-graph-data', auth, checkRole(['admin','super-admin']), getOrderGraph(this));
    
   


}

module.exports=dashboard;