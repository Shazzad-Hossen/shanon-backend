const Review = require('./review.schema');
const Order = require('../order/order.schema');


module.exports.createReview=()=>async(req,res)=>{
    try {
        if(!req.body.orderId || !req.body.rating || !req.body.comment) return res.status(400).send({message: 'Bad request'});
        const order = await Order.findOne({_id: req.body.orderId});
        if(!order) return res.status(404).send({message:'Invalid orderId'});

        const entries = order.items.map(item=>({
            user: req.user._id.toString(),
            product: item.product.toString(),
            rating: req.body.rating,
            comment: req.body.comment,
            order: order._id.toString()
        }));

    

    await Review.insertMany(entries);
    await Order.updateOne({ _id: req.body.orderId  }, { reviewed: true });


       
        return res.status(201).send({message:'Review created'})
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
        
    }
}

module.exports.getReviews=()=>async(req,res)=>{
    try {
        const query={};
        if(req.query.product) query.product= req.query.product;
        if(req.query.user) query.user= req.query.user;
        const reviews = await Review.find({...query}).populate({path:'user product', select:'-password'});
        return res.status(200).send({data:reviews});
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
        
    }
}

module.exports.getOrderReviews=()=>async(req,res)=>{
    try {

        const reviews = await Review.find({user: req.user._id.toString(), order: req.params.orderId});
        return res.status(200).send({data:reviews})
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
        
    }
}