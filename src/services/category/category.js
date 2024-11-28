const { auth, checkRole } = require("../middlewares");
const { createCategory, getAllCategory, deleteCategory } = require("./category.entity");


function category(){
    //create new category
    this.route.post('/category', auth, checkRole(['super-admin']),createCategory(this));
    this.route.get('/category',getAllCategory(this));
    this.route.delete('/category/:_id', auth, checkRole(['super-admin']),deleteCategory(this));



    
    


}

module.exports=category;