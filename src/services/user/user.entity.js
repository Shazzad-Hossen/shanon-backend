const { getOtpTemplate } = require('../../utils/otpEmailTemplate');
const User = require('./user.schema');

const createAllowed= new Set(['fullName','email', 'password']);
const updateAllowed= new Set(['fullName', 'password', 'newPassword']);



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
        console.log(req.body);
        if(!req.body.email || !req.body.password) return res.status(400).send({success:false, message:'Bad request'});
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(404).send({success:false, message:'No user found with this email address'});
        const password = crypto.decrypt(user.password);
      
        if(password!=req.body.password.trim()) return res.status(400).send({success:false, message:'Incorrect Password'});
        const bearerToken= crypto.encrypt({_id: user._id, email:user.email});
        res.cookie(settings.COOKIE_NAME, bearerToken, {
            httpOnly: true,
      ...settings.useHTTP2 && {
        sameSite: 'None',
        secure: true,
      },
      ...!req.body.rememberMe && { expires: new Date(Date.now() + 172800000/*2 days*/) },
    });
        return res.status(200).send({success: true, message:'Credential matched', Authorization: 'BEARER '+bearerToken, data: user})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.me=()=>async(req,res)=>{
    try {
      return res.status(200).send({success: true, message:'Authorized', data: req.user})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
}

module.exports.signout = ({ settings }) => async (req, res) => {
    try {
      res.clearCookie(settings.COOKIE_NAME, {
        httpOnly: true,
        ...settings.useHTTP2 && {
          sameSite: 'None',
          secure: true,
        },
        expires: new Date(Date.now())
      });
      return res.status(200).send({message:'Signout successful'});
    }
    catch (err) {
      console.log(err);
      return res.status(500).send({success:false, message:'Something went wrong'});
    }
  };
  

  module.exports.updateProfile=({crypto})=>async(req,res)=>{
    try {
        const valid = Object.keys(req.body).every(key=>updateAllowed.has(key));
        if(!valid) return res.status(400).send({message:'bad request'});
        if(req.body.password && req.body.newPassword){
            const password = crypto.decrypt(req.user.password);
            if(req.body.password!==password) return res.status(400).send({message:'Incorrect password'})
            req.body.password = crypto.encrypt(req.body.newPassword);
        delete req.body.newPassword
        }
        Object.keys(req.body).forEach(key=>req.user[key]=req.body[key]);
        await req.user.save();
        return res.status(200).send({message: 'Profile successfully updated'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
        
    }
  }


  module.exports.forGotPassword=({crypto, mail})=>async(req,res)=>{{
    try {
      if(!req.body.email) return res.status(400).send({message:'Bad request'});
      const user = await User.findOne({email: req.body.email});
      if(!user) return res.status(404).send({message:'No user found with this email address'});
      //send email with link to reset password
      const otp = Math.floor(1000 + Math.random() * 9000);
      const template = getOtpTemplate(otp);
      const token = crypto.encrypt({otp, email: req.body.email, validity:  new Date(new Date().getTime() + 5 * 60 * 1000)});
      await mail({receiver: req.body.email, subject:'Password reset OTP', body:template, type:'html'});
      res.status(200).send({message:'OTP sent to your email address', token});


      
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
      
    }
  }}


  module.exports.verityOtp=({crypto})=>async(req,res)=>{
    try {
      if(!req.body.otp || !req.body.token || !req.body.email) return res.status(400).send({message:'Bad request'});
      const {otp, email, validity} = crypto.decrypt(req.body.token);
      if(otp!=req.body.otp) return res.status(400).send({message:'Incorrect OTP'});
      if(new Date()>validity) return res.status(400).send({message:'OTP expired'});
      const token = crypto.encrypt({ email: req.body.email, validity:  new Date(new Date().getTime() + 5 * 60 * 1000)});
      return res.status(200).send({message:'OTP verified successfully', token});
      
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
      
    }
  }

  module.exports.resetPassword=({crypto})=>async(req,res)=>{
    try {
      if(!req.body.newPassword || !req.body.token || !req.body.email) return res.status(400).send({message:'Bad request'});
      const { email, validity} = crypto.decrypt(req.body.token);
 
      if(new Date()>validity) return res.status(401).send({message:'Unauthorized access'});
      const user = await User.findOne({email});
      if(!user) return res.status(404).send({message:'No user found with this email address'});
      user.password = crypto.encrypt(req.body.newPassword);
      await user.save();
      return res.status(200).send({message:'Password reset successfully'});
      
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false, message:'Something went wrong'});
      
    }
  }