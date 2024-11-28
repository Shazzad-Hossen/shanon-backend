const User = require('./user.schema');

const createAllowed= new Set(['fullName','email', 'password']);


module.exports.createUser=({crypto})=>async(req,res)=>{
    try {
        const valid = Object.keys(req.body).every(key=>createAllowed.has(key)) && [...createAllowed].every(key=>Object.keys(req.body).includes(key));
        if(!valid) return res.status(400).send({success:false, message:'Bad request'});
        const existingUser= await User.findOne({email:req.body.email.trim().toLowerCase()});
        if(existingUser) return res.status(403).send({success:false, message:"User already exist with this email"});
        req.body.password = crypto.encrypt(req.body.password);
        const user = await User.create(req.body);
        
        res.status(201).send({success: true, message:'User successfully created', data:user});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.login=({crypto,settings})=>async(req,res)=>{
    try {
        if(!req.body.email || !req.body.password) return res.status(400).send({success:false, message:'Bad request'});
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(404).send({success:false, message:'No user found with this email address'});
        const password = crypto.decrypt(user.password);
        if(!password===req.body.password.trim()) return res.status(400).send({success:false, message:'Incorrect Password'});
        const bearerToken= crypto.encrypt({_id: user._id, email:user.email});
        res.cookie(settings.COOKIE_NAME, bearerToken, {
            httpOnly: true,
            ...settings.useHTTP2 && {
              sameSite: 'None',
              secure: true,
            },
            expires: new Date(Date.now() + 172800000/*2 days*/)
          });
        return res.status(200).send({success: true, message:'Credential matched', Authorization: 'BEARER '+bearerToken, data: user})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}