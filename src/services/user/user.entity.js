const { getOtpTemplate } = require('../../utils/otpEmailTemplate');
const User = require('./user.schema');
const Order = require('../order/order.schema');
const Cart = require('../cart/cart.schema');
const createAllowed = new Set(['fullName', 'email', 'password']);
const updateAllowed = new Set(['fullName', 'password', 'newPassword']);
const accessList=new Set(['inventory', 'order', 'user', 'banner', 'category', 'subcategory', 'colorFamily', 'content', 'message', 'faqs', 'tmc', 'aboutUs']);



module.exports.createUser = ({ crypto }) => async (req, res) => {
  try {
    const valid = Object.keys(req.body).every(key => createAllowed.has(key)) && [...createAllowed].every(key => Object.keys(req.body).includes(key));
    if (!valid) return res.status(400).send({ success: false, message: 'Bad request' });
    const existingUser = await User.findOne({ email: req.body.email.trim().toLowerCase() });
    if (existingUser) return res.status(403).send({ success: false, message: "User already exist with this email" });
    req.body.password = crypto.encrypt(req.body.password);
    const user = await User.create(req.body);

    res.status(201).send({ success: true, message: 'User successfully created', data: user });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });

  }
}

module.exports.login = ({ crypto, settings }) => async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.password) return res.status(400).send({ success: false, message: 'Bad request' });
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ success: false, message: 'No user found with this email address' });
    const password = crypto.decrypt(user.password);

    if (password != req.body.password.trim()) return res.status(400).send({ success: false, message: 'Incorrect Password' });
    const bearerToken = crypto.encrypt({ _id: user._id, email: user.email });
    res.cookie(settings.COOKIE_NAME, bearerToken, {
      httpOnly: true,
      ...settings.useHTTP2 && {
        sameSite: 'None',
        secure: true,
      },
      ...!req.body.rememberMe && { expires: new Date(Date.now() + 172800000/*2 days*/) },
    });
    const cart = await Cart.find({ user: user._id }).populate('product');
    let userObj = JSON.parse(JSON.stringify(user));
    return res.status(200).send({ success: true, message: 'Credential matched', Authorization: 'BEARER ' + bearerToken, data: {...userObj, cart: cart} })

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });

  }
}

module.exports.me = () => async (req, res) => {
  try {
    return res.status(200).send({ success: true, message: 'Authorized', data: req.user })

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });

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
    return res.status(200).send({ message: 'Signout successful' });
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: 'Something went wrong' });
  }
};


module.exports.updateProfile = ({ crypto }) => async (req, res) => {
  try {
    const valid = Object.keys(req.body).every(key => updateAllowed.has(key));
    if (!valid) return res.status(400).send({ message: 'bad request' });
    if (req.body.password && req.body.newPassword) {
      const password = crypto.decrypt(req.user.password);
      if (req.body.password !== password) return res.status(400).send({ message: 'Incorrect password' })
      req.body.password = crypto.encrypt(req.body.newPassword);
      delete req.body.newPassword
    }
    Object.keys(req.body).forEach(key => req.user[key] = req.body[key]);
    await req.user.save();
    return res.status(200).send({ message: 'Profile successfully updated' })

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });

  }
}


module.exports.forGotPassword = ({ crypto, mail }) => async (req, res) => {
  {
    try {
      if (!req.body.email) return res.status(400).send({ message: 'Bad request' });
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).send({ message: 'No user found with this email address' });
      //send email with link to reset password
      const otp = Math.floor(1000 + Math.random() * 9000);
      const template = getOtpTemplate(otp);
      const token = crypto.encrypt({ otp, email: req.body.email, validity: new Date(new Date().getTime() + 5 * 60 * 1000) });
      await mail({ receiver: req.body.email, subject: 'Password reset OTP', body: template, type: 'html' });
      res.status(200).send({ message: 'OTP sent to your email address', token });



    } catch (error) {
      console.log(error);
      return res.status(500).send({ success: false, message: 'Something went wrong' });

    }
  }
}


module.exports.verityOtp = ({ crypto }) => async (req, res) => {
  try {
    if (!req.body.otp || !req.body.token || !req.body.email) return res.status(400).send({ message: 'Bad request' });
    const { otp, email, validity } = crypto.decrypt(req.body.token);
    if (otp != req.body.otp) return res.status(400).send({ message: 'Incorrect OTP' });
    if (new Date() > validity) return res.status(400).send({ message: 'OTP expired' });
    const token = crypto.encrypt({ email: req.body.email, validity: new Date(new Date().getTime() + 5 * 60 * 1000) });
    return res.status(200).send({ message: 'OTP verified successfully', token });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });

  }
}

module.exports.resetPassword = ({ crypto }) => async (req, res) => {
  try {
    if (!req.body.newPassword || !req.body.token || !req.body.email) return res.status(400).send({ message: 'Bad request' });
    const { email, validity } = crypto.decrypt(req.body.token);

    if (new Date() > validity) return res.status(401).send({ message: 'Unauthorized access' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'No user found with this email address' });
    user.password = crypto.encrypt(req.body.newPassword);
    await user.save();
    return res.status(200).send({ message: 'Password reset successfully' });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });

  }
}

module.exports.getAllUsers = () => async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query; // Set default values
    const query = {};
    if (req?.query?.orderId && req?.query?.orderId !== '') query.orderId = req.query.orderId;
    if (req?.query?.user && req?.query?.user !== '') query.user = req.query.user;
    if (req?.query?.role && req?.query?.role !== '') query.role = req.query.role;
    if (req.query.fullName) query.fullName = { $regex: req.query.fullName, $options: 'i' };

    const users = await User.paginate(
      { ...query },
      {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: { createdAt: -1 }
      }
    );

    return res.status(200).send({ data: users });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });

  }
}

module.exports.userStats = () => async (req, res) => {
  try {
    const _id = req?.params?._id;
    if (!_id) return res.status(400).send({ message: 'Bad request' });
    else if (req.user.role==='user') return res.status(401).send({ message: 'Unauthorized access' });
    const user = await User.findById(_id);
    if (!user) return res.status(404).send({ message: 'No user found with this id' });
    const count = await Order.aggregate([
      {
        '$match': {
          'user': user._id
        }
      },
      {
        '$group': {
          '_id': '$status',
          'count': {
            '$sum': 1
          }
        }
      }
    ]);
    let total = 0;
    count.forEach(c => total += c.count);
    const data = { total };
    count.forEach(c => data[c._id] = c.count);

    return res.status(200).send({ data:{stats:data, user:user} });


  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });

  }
}


module.exports.createAdmin = ({ crypto }) => async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'super-admin') return res.status(401).send({ success: false, message: 'Unauthorized access' });
    if(!req.body.email || !req.body.fullName || !req.body.accessList) return res.status(400).send({ success: false, message: 'Bad request' });
    const valid = Object.keys(req.body.accessList).every(key => accessList.has(key)) && [...accessList].every(key => Object.keys(req.body.accessList).includes(key));
    if (!valid) return res.status(400).send({ success: false, message: 'Bad request' });
    const existingUser = await User.findOne({ email: req.body.email.trim().toLowerCase() });
    if (existingUser) return res.status(403).send({ success: false, message: "User already exist with this email" });
    req.body.password = crypto.encrypt(req.body.email);
    req.body.role = 'admin';
    const user = await User.create(req.body);

    res.status(201).send({ success: true, message: 'Admin successfully created', data: user });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });
    
  }
}
module.exports.updateAdminAccess=()=>async(req,res)=>{
  try {
    if(!req.body.userId || !req.body.access) return res.status(400).send({ success: false, message: 'Bad request' });
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) return res.status(404).send({ success: false, message: 'No user found with this id' });
    const valid = Object.keys(req.body.access).every(key => accessList.has(key));
    if (!valid) return res.status(400).send({ success: false, message: 'Bad request' });
    Object.keys(req.body.access).forEach(key => user.accessList[key] = req.body.access[key]);
    await user.save();
    return res.status(200).send({ success: true, message: 'Access updated successfully' });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });
    
  }
}


module.exports.deleteUser = () => async (req, res) => {
  try {
    if(!req.params._id) return res.status(400).send({ success: false, message: 'Bad request' });
    const deleted = await User.deleteOne({ _id: req.params._id });
    if(deleted.deletedCount===0) return res.status(404).send({ success: false, message: 'No user found with this id' });
    return res.status(200).send({ success: true, message: 'User deleted successfully' });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Something went wrong' });
    
  }
}
 