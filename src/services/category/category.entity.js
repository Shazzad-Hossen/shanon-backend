const Category = require('./category.schema');

module.exports.createCategory=()=>async(req,res)=>{
    try {
        if(!req.body.name) return res.status(400).send({success:false, message:'bad request'});

        const exist = await Category.findOne({name: req.body.name});
        if(exist) return res.status(403).send({success:false, message:'Category already exist'});
        const category = await Category.create({name: req.body.name});
        return res.status(201).send({success:true, message:'Category successfully created', data: category});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.getAllCategory=()=>async(req,res)=>{
    try {
        const categories = await Category.find();
        return res.status(201).send({success:true, message:'All categories successfully fetched', data: categories});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.editCategory=()=>async(req,res)=>{
    try {
       if(!req.params._id || !req.body.name) return res.status(400).send({success:false, message:'Bad request'});
       const category = await Category.findOne({_id:req.params._id});
       if(!category) return res.status(404).send({success:false, message:'Invalid category id'});
       category.name= req.body.name;
       await category.save();
       return res.status(200).send({success: true, message:'Categoru successfully updated', data:  category});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.deleteCategory=()=>async(req,res)=>{
    try {
        if(!req.params._id) return res.status(400).send({success:false, message:'bad request'});
        const deleteRes= await Category.deleteOne({_id:req.params._id});
        if(deleteRes.acknowledged && deleteRes.deletedCount) return res.status(200).send({success:true, message:'Category successfully deleted'});
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}