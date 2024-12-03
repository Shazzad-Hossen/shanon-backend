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
  
      const products = await Product.paginate(
        {}, // Query filter
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
  