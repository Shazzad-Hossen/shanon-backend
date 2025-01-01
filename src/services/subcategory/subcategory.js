const { auth, checkRole } = require("../middlewares");
const {  createSubCategory, getAllSubCategory, deleteSubCategory, editSubCategory, getSingleSubCategory } = require("./subcategory.entity");


function subCategory(){
    //create new category
    this.route.post('/sub-category', auth, checkRole(['super-admin','admin']),createSubCategory(this));
    this.route.get('/sub-category',getAllSubCategory(this));
    this.route.get('/sub-category/:_id', auth, checkRole(['super-admin', 'admin']),getSingleSubCategory(this));
    this.route.delete('/sub-category/:_id', auth, checkRole(['super-admin', 'admin']),deleteSubCategory(this));
    this.route.patch('/sub-category/:_id', auth, checkRole(['super-admin', 'admin']),editSubCategory(this));

    



    
    


}

module.exports=subCategory;