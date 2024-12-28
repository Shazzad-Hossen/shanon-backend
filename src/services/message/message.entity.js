const Message = require("./message.schema");
const createAllowed= new Set(['name','message','subject','email']);

module.exports.createMessage =()=>async(req,res)=>{
    try {
        const valid = Object.keys(req.body).every((key)=>createAllowed.has(key));
        if(!valid) return res.status(400).send({success:false, message:'Bad request'});
        const message = await Message.create(req.body);
        return res.status(201).send({success:true, message:'Message successfully created'});
          
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
    }

}

module.exports.getMessages =()=>async(req,res)=>{
    try {
        const { limit = 10, page = 1 } = req.query;
        const query ={}
        if(req?.query?.orderId && req?.query?.orderId!=='' ) query.orderId= req.query.orderId;
                  if(req?.query?.user && req?.query?.user!=='' ) query.user= req.query.user;
              
                  const messages = await Message.paginate(
                    {...query}, 
                    {
                      limit: parseInt(limit),
                      page: parseInt(page),
                      sort: { createdAt: -1 }
                    }
                  );
              
                  return res.status(200).send({ data: messages });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.deleteMessage =()=>async(req,res)=>{
    try {
        if(!req?.params?.id) return res.status(400).send({success:false, message:'Bad request'});
        const deleted = await Message.findByIdAndDelete(req.params.id);
        if(deleted.deletedCount===0) return res.status(404).send({ success: false, message: 'No user found with this id' });
        return res.status(200).send({ success: true, message: 'Message successfully deleted' });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.updateMessage =()=>async(req,res)=>{
    try {
        if(!req.body._id || !req.body.seen) return res.status(400).send({success:false, message:'Bad request'});
        const message = await Message.findOneAndUpdate({_id:req.body._id}, {seen:req.body.seen}, {new:true});
        if(!message) return res.status(404).send({ success: false, message: 'No message found with this id' });
        return res.status(200).send({ success: true, message: 'Message successfully updated', data: message });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.getSingleMessage =()=>async(req,res)=>{
    try {
        if(!req.params.id) return res.status(400).send({success:false, message:'Bad request'});
        const message = await Message.findOne({_id:req.params.id});
        if(!message) return res.status(404).send({ success: false, message: 'No message found with this id' });
        return res.status(200).send({ success: true, message: 'Message successfully fetched', data: message });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}