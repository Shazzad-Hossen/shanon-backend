const path = require('path');
const fs = require('fs');
const Brand= require('./brands.schema');
module.exports.addBrandLogo =({fileUp})=>async(req,res)=>{
    try {
        if(!req?.files?.image) return res.status(400).send({message: 'Bad request'})
        const image = await fileUp(req.files.image.path);
        const brand = await Brand.create({image});
        return res.status(201).send({data: brand});
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' }); 
    }
}


module.exports.getBrandImages=()=>async(req,res)=>{
    try {

        const brands= await Brand.find();
        console.log(brands);
        return res.status(200).send({data:brands})

        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' }); 
        
    }
}


module.exports.deleteBrandImage=()=>async(req,res)=>{
    try {
        if(!req.params._id) return res.status(400).send({message:'Bad request'});
        const exist = await Brand.findOne({_id: req.params._id});
        if(!exist) return res.status(404).send({message:'Invalid brand image id'});
        const fullPath = path.resolve(__dirname,'../../../files', exist?.image?.split('file/')[1]);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
                              
        }
        await Brand.deleteOne({ _id: req.params._id });
                
        return res.status(200).send({ message: 'Brand Image deleted successfully' });


    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' }); 
        
    }
}