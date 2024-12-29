const Cart = require('./cart.schema');

module.exports.addToCart = () => async (req, res) => {
    try {
        // Validate request body
        if (!req.body.product || !req.body.variant || !req.body.quantity) {
            return res.status(400).send({ success: false, message: 'Bad request' });
        }

        // Check if the product already exists in the user's cart
        const exist = await Cart.findOne({
            product: req.body.product,
            user: req.user._id.toString(),
            variant: req.body.variant
        });

        if (exist) {
            // Update quantity if the item exists
            exist.quantity = req.body.quantity + exist.quantity;
            await exist.save();
        } else {
            // Create a new cart item if it doesn't exist
            await Cart.create({
                product: req.body.product,
                user: req.user._id.toString(),
                variant: req.body.variant,
                quantity: req.body.quantity
            });
        }

        // Fetch all cart items for the user and populate the product field
        const data = await Cart.find({ user: req.user._id.toString() }).populate('product');

        // Send the response with all cart items
        return res.status(200).send({
            success: true,
            message: 'Cart updated successfully',
            data: data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
};

module.exports.getCart = () => async (req, res) => {
    try {
        // Fetch all cart items for the user and populate the product field
        const data = await Cart.find({ user: req.user._id.toString() }).populate('product');

        // Send the response with all cart items
        return res.status(200).send({
            success: true,
            message: 'Cart items fetched successfully',
            data: data
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Something went wrong' });
        
    }
}

module.exports.removeFromCart = () => async (req, res) => {{
    try {
        // Validate request body
        if (!req.body._id) {
            return res.status(400).send({ success: false, message: 'Bad request' });
        }

        // Find and delete the cart item
        await Cart.findOneAndDelete({
            _id: req.body._id,
        });

        // Fetch all cart items for the user and populate the product field
        const data = await Cart.find({ user: req.user._id.toString() }).populate('product');

        // Send the response with all cart items
        return res.status(200).send({
            success: true,
            message: 'Cart updated successfully',
            data: data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Something went wrong' });
    }
}};


module.exports.emptyCart = () => async (req, res) => {{
    try {
        // Delete all cart items for the user
        await Cart.deleteMany({ user: req.user._id.toString() });

        // Send the response with all cart items
        return res.status(200).send({
            success: true,
            message: 'Cart emptied successfully',
            data: []
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Something went wrong' });
        
    }
}}