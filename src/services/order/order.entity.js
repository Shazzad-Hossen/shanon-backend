const Order = require('./order.schema');
const createAllowed= new Set(['region', 'city', 'area', 'name', 'address', 'phone','items'])
module.exports.createOrder= ()=>async(req,res)=>{
  try {
    const valid = Object.keys(req.body).every(key=>createAllowed.has(key)) && [...createAllowed].every(key=>Object.keys(req.body).includes(key));
    if(!valid) return res.status(400).send({message:'Bad request'});
    req.body.user= req.user._id.toString();
    const order = await Order.create(req.body);
    if(!order)  return res.status(500).send({message: 'Something went wrong'});
    return res.status(201).send({data: order});
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: 'Something went wrong'});
    
  }
}

module.exports.getAllOrders=()=>async(req,res)=>{
  try {
     const { limit = 10, page = 1 } = req.query; // Set default values

        
          const query={};
          if(req?.query?.user){
            if(req.user._id.toString()!==req.query.user &&( req.user.role==='user')) return res.status(401).send({message:'Unauthorized'});
            query.user=req.query.user;
          }
          
          if(req?.query?.orderId && req?.query?.orderId!=='' ) query.orderId= req.query.orderId;
          if(req?.query?.user && req?.query?.user!=='' ) query.user= req.query.user;
      
          const orders = await Order.paginate(
            {...query}, 
            {
              populate: [
                { path: 'user' }, 
                { path: 'region' }, 
                { path: 'city' }, 
                { path: 'area' }, 
                { path: 'items.variant' },
                { path: 'items.product' },

              ],
              limit: parseInt(limit),
              page: parseInt(page),
              sort: { createdAt: -1 }
            }
          );
      
          return res.status(200).send({ data: orders });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: 'Something went wrong'});
    
  }
}


module.exports.getSingleOrder = () => async (req, res) => {
  try {
    if (!req.params._id) {
      return res.status(400).send({ message: 'Bad request' });
    }

    // Fetch the order and populate nested fields
    const order = await Order.findOne({ _id: req.params._id })
      .populate('user region city area')
      .populate({
        path: 'items.product',
        populate: {
          path: 'variants.color', // Populate nested color field
          model: 'Color', // Ensure the correct model name
        },
      });

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    return res.status(200).send({ data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

module.exports.changeOrderStatus=()=>async(req,res)=>{
  try {
    const status= req?.query?.status;
    const _id= req?.query?._id;   
  
  

    if(!status || !_id) return res.status(400).send({message:'Bad request'});
    if(!['pending','processing', 'delivered', 'cancelled'].includes(status)) return res.status(400).send({message:'Bad request'});
   const order = await Order.findOne({_id})
    .populate('user region city area')
    .populate({
      path: 'items.product',
      populate: {
        path: 'variants.color',
        model: 'Color',
      },
    });
    if(!order) return res.status(404).send({message:'Order not found'});
    if(req.user.role=='user') {
      if(req?.query?.total) return res.status(403).send({message:'Forbidden'});
      else if(req.user._id.toString()!==order.user._id.toString())  return res.status(401).send({message:'Unauthorized'});
      else if(order.status!=='pending') return res.status(401).send({message:'Unauthorized'});
      else if(status!=='cancelled') return res.status(401).send({message:'Unauthorized'});

    }
    
    order.status=status;
    if(req?.query?.total) order.total=req.query.total;
    await order.save()
    return res.status(200).send({data:order})

    
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Something went wrong' });
    
  }
}
