const Product=require('../product/product.schema');
const Order=require('./order.schema');
module.exports.deductQuantity=async(items)=>{
    console.log(items);
    try {
        for(let i=0;i<items.length;i++){
            const product= await Product.findOne({_id: items[i].product});
            if(!product) throw new Error('Product not found');
            const variant= product.variants.find(v=>v.color.toString().toString()===items[i].variant);
            if(!variant) throw new Error('Variant not found');
            if(variant.stock<items[i].quantity) throw new Error('Not enough quantity');
            variant.stock-=items[i].quantity;
            await product.save();
        }

        
    } catch (error) {
        console.log(error);
        
    }

}

module.exports.adjustquantity=async(order)=>{
    try {
        if(order.status!=='cancelled' && !order.deducted){
            for(let i=0;i<order.items.length;i++){
                const product= await Product.findOne({_id: order.items[i].product._id});
                if(!product) throw new Error('Product not found');
                const variant= product.variants.find(v=>v.color.toString()===order.items[i].variant);
                if(!variant) throw new Error('Variant not found');
                variant.stock-=order.items[i].quantity;
                await product.save();

            }
            const _order= await Order.findOne({_id: order._id});
            _order.deducted=true;
            await _order.save();

        }
        else if(order.status=='cancelled' && order.deducted){
            for(let i=0;i<order.items.length;i++){
                const product= await Product.findOne({_id: order.items[i].product._id});
                if(!product) throw new Error('Product not found');
                const variant= product.variants.find(v=>v.color.toString()===order.items[i].variant);
                if(!variant) throw new Error('Variant not found');
                variant.stock+=order.items[i].quantity;
                await product.save();

            }
            const _order= await Order.findOne({_id: order._id});
            _order.deducted=false;
            await _order.save();
        }
     
        
    } catch (error) {
        console.log(error);
        
    }

}