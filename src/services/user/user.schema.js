const { model, Schema } = require("mongoose");
const paginate = require('mongoose-paginate-v2');


const schema = new Schema({
  email: { type: String, required: true, unique:true },
  fullName: { type: String, required:true },
  password: { type: String, required: true },
  role: { type: String, enum:['user', 'admin','super-admin'], default:'user'},
  accessList:{
    inventory: { type: Boolean, default: false },
    order: { type: Boolean, default: false },
    user: { type: Boolean, default: false },
    banner: { type: Boolean, default: false },
    category: { type: Boolean, default: false },
    subcategory: { type: Boolean, default: false },
    colorFamily: { type: Boolean, default: false },
    content: { type: Boolean, default: false },
    message: { type: Boolean, default: false },
    faqs: { type: Boolean, default: false },
    tmc: { type: Boolean, default: false },
    aboutUs: { type: Boolean, default: false },
    
  }
 
}, { timestamps: true });
schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.password;
  delete obj.updatedAt;
 
  return JSON.parse(JSON.stringify(obj));
};

module.exports= model('User', schema);