const Subcategory = require('./subcategory.schema');

module.exports.createSubCategory=()=>async(req,res)=>{
    try {
        if(!req.body.name || !req.body.category) return res.status(400).send({success:false, message:'bad request'});

        const exist = await Subcategory.findOne({name: req.body.name, category: req.body.category});
        if(exist) return res.status(403).send({success:false, message:'SubCategory already exist'});
        const subcategory = await Subcategory.create({name: req.body.name, category: req.body.category});
        return res.status(201).send({success:true, message:'Category successfully created', data: subcategory});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.getAllSubCategory=()=>async(req,res)=>{
    try {
        if(!req.query.category) return res.status(400).send({success:false, message:'bad request'});
        const subcategories = await Subcategory.find({category: req?.query?.category});
        return res.status(201).send({success:true, message:'All categories successfully fetched', data: subcategories});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.editSubCategory=()=>async(req,res)=>{
    try {
       if(!req.params._id || !req.body.name) return res.status(400).send({success:false, message:'Bad request'});
       const subcategory = await Subcategory.findOne({_id:req.params._id});
       if(!subcategory) return res.status(404).send({success:false, message:'Invalid subcategory id'});
       subcategory.name= req.body.name;
       await subcategory.save();
       return res.status(200).send({success: true, message:'Subcategoru successfully updated', data:  subcategory});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}



module.exports.deleteSubCategory=()=>async(req,res)=>{
    try {
        if(!req.params._id) return res.status(400).send({success:false, message:'bad request'});
        const deleteRes= await Subcategory.deleteOne({_id:req.params._id});
        if(deleteRes.acknowledged && deleteRes.deletedCount) return res.status(200).send({success:true, message:'Subcategory successfully deleted'});
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}
