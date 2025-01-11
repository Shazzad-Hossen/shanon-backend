const Content= require('./content.schema');     
const updateAllowed=new Set(['footerDescription', 'address', 'phone', 'email', 'facebookUrl', 'instagramUrl', 'youtubeUrl', 'twitterUrl', 'playStoreUrl', 'faqs', 'termsAndConditions', 'aboutUs', 'showBrands']);

module.exports.updateContent=()=>async(req,res)=>{
    try {
        const valid = Object.keys(req.body).every((key)=>updateAllowed.has(key));
        if(!valid) return res.status(400).send({success:false, message:'Bad request'});
        const contents= await Content.find();
        if(contents?.length===0){
            const content = await Content.create(req.body);
            return res.status(200).send({success:true, message:'Content successfully updated', data: content});
        }
        else{
            Object.keys(req.body).forEach((key)=>contents[0][key]=req.body[key]);
            await contents[0].save();
            return res.status(200).send({success:true, message:'Content successfully updated', data: contents[0]}); 
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}


module.exports.getContent=()=>async(req,res)=>{
    try {
        const contents = await Content.find();
        if(contents?.length>0) return res.status(200).send({success:true, message:'Content successfully fetched', data: contents[0]});
        return res.status(200).send({success:true, message:'Content successfully fetched', data: {}});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}