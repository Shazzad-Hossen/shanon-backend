const Region = require('./region.schema');
const City = require('./city.schema');
const Area = require('./area.schema');
module.exports.createRegion=()=>async(req,res)=>{
    try {
        if(!req.body.name || !req.body.id) return res.status(400).send({message: 'Bad Request'});
        const region = await Region.create({name: req.body.name, id:req.body.id});
        return res.status(201).send({data: region});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.getAllRegion=()=>async(req,res)=>{
    try {
        const regions = await Region.find();
        return res.status(200).send({data: regions});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.createCity=()=>async(req,res)=>{
    try {
        if(!req.body.name || !req.body.region || !req.body.id) return res.status(400).send({message: 'Bad Request'});
        const city = await City.create({name: req.body.name, region: req.body.region, id: req.body.id});
        return res.status(201).send({data: city});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.getAllCities=()=>async(req,res)=>{
    try {
        const query={};
        if(req.query.region) query.region= req.query.region
        const cities = await City.find({...query});
        return res.status(200).send({data: cities});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.createArea=()=>async(req,res)=>{
    try {
        if(!req.body.name || !req.body.id ||  !req.body.city ||  !req.body.region) return res.status(400).send({message: 'Bad Request'});
        const region = await Area.create({name: req.body.name, id:req.body.id, city: req.body.city, region: req.body.region});
        return res.status(201).send({data: region});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.getAllAreas=()=>async(req,res)=>{
    try {
        const query={};
        if(req.query.city ) query.city= req.query.city
        const areas = await Area.find({...query});
        return res.status(200).send({data: areas});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}