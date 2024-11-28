const { model, Schema } = require("mongoose");
const paginate = require('mongoose-paginate-v2');


const schema = new Schema({
  email: { type: String, required: true, unique:true },
  fullName: { type: String, required:true },
  password: { type: String, required: true },
  role: { type: String, enum:['user', 'admin','super-admin'], default:'user'},
 
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