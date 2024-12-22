const { auth, checkRole } = require("../middlewares");
const {  createSubCategory, getAllSubCategory, deleteSubCategory, editSubCategory, getSingleSubCategory } = require("./subcategory.entity");


function subCategory(){
    //create new category
    this.route.post('/sub-category', auth, checkRole(['super-admin']),createSubCategory(this));
    this.route.get('/sub-category', auth,getAllSubCategory(this));
    this.route.get('/sub-category/:_id', auth, checkRole(['super-admin']),getSingleSubCategory(this));
    this.route.delete('/sub-category/:_id', auth, checkRole(['super-admin']),deleteSubCategory(this));
    this.route.patch('/sub-category/:_id', auth, checkRole(['super-admin']),editSubCategory(this));

    



    
    


}

module.exports=subCategory;