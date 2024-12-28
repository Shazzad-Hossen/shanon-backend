const { model, Schema } = require("mongoose");
const paginate = require('mongoose-paginate-v2');


const schema = new Schema({
  footerDescription: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  facebookUrl: { type: String },
  instagramUrl: { type: String },
  youtubeUrl: { type: String },
  twitterUrl: { type: String },
  playStoreUrl: { type: String },
  faqs: { type: Array },
  termsAndConditions: { type: String },
  aboutUs: { type: String },
  

}, { timestamps: true });
schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
 
  return JSON.parse(JSON.stringify(obj));
};

module.exports= model('Content', schema);