const Review = require('./review.schema');

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

