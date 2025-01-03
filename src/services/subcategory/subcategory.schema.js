const { model, Schema } = require("mongoose");
const paginate = require('mongoose-paginate-v2');


const schema = new Schema({
  name: { type: String, required: true, unique:true },
  image: { type: String, required: true, },
  category: { type:Schema.Types.ObjectId, ref:'Category'},

}, { timestamps: true });
schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
 
  return JSON.parse(JSON.stringify(obj));
};

module.exports= model('Subcategory', schema);