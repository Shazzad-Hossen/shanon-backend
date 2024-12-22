const Banner = require('./banner.schema');
const path = require('path');
const fs = require('fs');

module.exports.createBanner=({fileUp})=>async(req,res)=>{
    try {
        const title = req?.body?.title;
        const image = req?.files?.image;
        if(!title || !image) return res.status(400).send({ message: 'Bad request' });
        const uploadedImage = await fileUp(image.path);
      
        const banner = await Banner.create({ title, image: uploadedImage });
        if(!banner) return res.status(500).send({ message: 'Something went wrong' });
        return res.status(200).send({ data: banner });

        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
        
    }
}

module.exports.getAllBanners=()=>async(req,res)=>{
    try {
        const banners = await Banner.find({});
        return res.status(200).send({ data: banners });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
        
    }
}

module.exports.deleteBanner=()=>async(req,res)=>{
    try {
        if(!req.params._id) return res.status(400).send({ message: 'Bad request' });
        const banner = await Banner.findOne({ _id: req.params._id });
        if(!banner) return res.status(404).send({ message: 'Banner not found' });
         const fullPath = path.resolve(__dirname,'../../../files', banner?.image?.split('file/')[1]);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                      
                    }
        await Banner.deleteOne({ _id: req.params._id });
        
        return res.status(200).send({ message: 'Banner deleted successfully' });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
        
    }
}