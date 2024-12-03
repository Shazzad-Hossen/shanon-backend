const { model, Schema } = require("mongoose");
const paginate = require('mongoose-paginate-v2');


const schema = new Schema({
 variants: [
    { 
        stock: {type: Number},
        color: {type: Schema.Types.ObjectId, ref:'Color'}
     }
 ],
 description: { type: String, required: true },
 name: { type: String, required: true },
 price: { type: Number, required: true },
 shippingInsideDhaka: { type: Number, required: true },
 shippingOutsideDhaka: { type: Number, required: true },
 category: { type: Schema.Types.ObjectId, ref:'Category' ,required: true },
 subcategory: { type: Schema.Types.ObjectId, ref:'Subcategory' ,required: true },
 images:[ { type: String}],


}, { timestamps: true });
schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
 
  return JSON.parse(JSON.stringify(obj));
};

module.exports= model('Product', schema);