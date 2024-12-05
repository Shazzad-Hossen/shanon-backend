const Product = require('./product.schema');
const createAllowed=new Set(['variants','description','name','price','shippingInsideDhaka', 'shippingOutsideDhaka','category', 'subcategory']);

module.exports.addProduct=({fileUp})=>async(req,res)=>{
    try {
        if(!req.files?.file) return res.status(400).send({message: 'Bad request'});
        const files = Array.isArray(req.files?.file) ? req.files.file :[req.files.file] ;
        req.body= JSON.parse(req.body.data);
        const valid = Object.keys(req.body).every(key=>createAllowed.has(key)) && [...createAllowed].every(key=>Object.keys(req.body).includes(key));
        if(!valid) return res.status(400).send({message:'Bad request'});
        req.body.images=[];
        for(let i=0;i<files.length;i++){
            req.body.images.push(await fileUp(files[i].path));
        }
        const product = await Product.create(req.body);
        return res.status(200).send({data: product});   
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: 'Something went wrong'});
        
    }
}

module.exports.getAllProducts = () => async (req, res) => {
    try {
      const { limit = 10, page = 1 } = req.query; // Set default values
      const query={};
      
      if(req?.query?.subcategory && req?.query?.subcategory!=='null' ) query.subcategory= req.query.subcategory;
  
      const products = await Product.paginate(
        {...query}, // Query filter
        {
          populate: [
            { path: 'category' }, // Populate category
            { path: 'subcategory' }, // Populate subcategory
            { path: 'variants.color' }, // Populate color inside variants
          ],
          limit: parseInt(limit),
          page: parseInt(page),
        }
      );
  
      return res.status(200).send({ data: products });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Something went wrong' });
    }
  };

  module.exports.getSingleProduct=()=>async(req,res)=>{
    try {
      if(!req.params._id) return res.status(400).send({message:'Bad request'});
      const product = await Product.findOne({ _id: req.params._id })
      .populate('category subcategory')
      .populate('variants.color');
      if(!product) return res.status(404).send({message:'Product not found'});
      return res.status(200).send({data: product});

      
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Something went wrong' });
    
      
    }
  }
  

  module.exports.removeProduct=()=>async(req,res)=>{
    try {
      if(!req.params._id) return res.status(400).send({message:'Bad request'});

      const deleteRes= await Product.deleteOne({_id:req.params._id});
        if(deleteRes.acknowledged && deleteRes.deletedCount) return res.status(200).send({success:true, message:'Category successfully deleted'});
        return res.status(500).send({success:false, message:'Something went wrong'});
      
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Something went wrong' });
      
    }
  }