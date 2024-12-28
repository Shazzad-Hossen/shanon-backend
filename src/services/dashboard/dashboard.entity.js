const Order = require("../order/order.schema");

module.exports.dashboardStats=()=>async(req,res)=>{
    try {
        const count= await Order.aggregate([
            {
              '$group': {
                '_id': '$status', 
                'count': {
                  '$sum': 1
                }
              }
            }
          ]);
         let total=0;
         count.forEach(c=>total+=c.count);
         const data={total};
         count.forEach(c=>data[c._id]=c.count);
        return res.status(200).send({ message: 'Success', data });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
    }
}