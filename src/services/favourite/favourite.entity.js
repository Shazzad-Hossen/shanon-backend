const Favourite = require("./favourite.schema");


module.exports.addFavourite = ()=>async(req,res)=>{
    try {
    if(!req.body.product) return res.status(400).send({ message: 'Product is required' });
    const favourite = await Favourite.findOne({ product: req.body.product, user: req.user._id.toString() });
    if(favourite) return res.status(400).send({ message: 'Already added to favourite' });
    await Favourite.create({ product: req.body.product, user: req.user._id.toString() });
    const favouriteLis= await Favourite.find({user:req.user._id.toString()}).populate('product');
    return res.status(200).send({ message: 'Success', data: favouriteLis });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });

        
    }
}

module.exports.getFavourites = ()=>async(req,res)=>{
    try {
        const favouriteLis= await Favourite.find({user:req.user._id.toString()}).populate('product');
        return res.status(200).send({ message: 'Success', data: favouriteLis });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
    }
}

module.exports.removeFavourite = ()=>async(req,res)=>{
    try {
        if(!req.params.id) return res.status(400).send({ message: 'Product id is required' });
        const ress = await Favourite.findByIdAndDelete(req.params.id);
        console.log(ress);
        const favouriteLis= await Favourite.find({user:req.user._id.toString()}).populate('product');
        return res.status(200).send({ message: 'Success', data: favouriteLis });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
    }
}


module.exports.crearFavourite = ()=>async(req,res)=>{
    try {
        await Favourite.deleteMany({user:req.user._id.toString()});
        return res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
    }
}
