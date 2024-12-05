const { auth, checkRole } = require("../middlewares");
const { createCategory, getAllCategory, deleteCategory, editCategory, getAllCategoriesWithSubCategories } = require("./category.entity");


function category(){
    //create new category
    this.route.post('/category', auth, checkRole(['super-admin']),createCategory(this));
    this.route.get('/category',getAllCategory(this));
    this.route.delete('/category/:_id', auth, checkRole(['super-admin']),deleteCategory(this));
    this.route.patch('/category/:_id', auth, checkRole(['super-admin']),editCategory(this));
    this.route.get('/category-with-sub',getAllCategoriesWithSubCategories(this));
    



    
    


}

module.exports=category;