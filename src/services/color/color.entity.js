const Color = require('./color.schema');

module.exports.createColorFamily=()=>async(req, res)=>{
    try {
        if(!req.body.name || !req.body.colorCode) return res.status(400).send({message:'Bad request'});
        const isExist = await Color.findOne({name: req.body.name});
        if(isExist) return res.status(403).send({message:'Color family already exist'});
        const color = await Color.create({name: req.body.name , colorCode: req.body.colorCode});
        return res.status(201).send({message:'Successfully created', data: color})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Something went wrong'});
        
    }
}


module.exports.getAllColorFamily=()=>async(req,res)=>{
    try {
        const colors = await Color.find();
        return res.status(200).send({data: colors});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Something went wrong'});
        
    }
}


module.exports.deleteColorFamily=()=>async(req,res)=>{
    try {
        if(!req.params?._id) return res.status(400).send({message:'Bad request'});
        const deleteRes= await Color.deleteOne({_id:req.params._id});
        if(deleteRes.acknowledged && deleteRes.deletedCount) return res.status(200).send({success:true, message:'Subcategory successfully deleted'});
        return res.status(500).send({success:false, message:'Something went wrong'});

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Something went wrong'});
        
    }
}


module.exports.editColorFamily=()=>async(req,res)=>{
    try {
        if(!req.params._id || !req.body.name || !req.body.colorCode) return res.status(400).send({message:'Bad request'});
        const color = await Color.findOne({_id: req.params._id});
        if(!color) return res.status(404).send({message: 'Invalid color _id'});
        color.name= req.body.name;
        color.colorCode = req.body.colorCode;
        await color.save();
        return res.status(200).send({data:color});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Something went wrong'});
        
    }

}