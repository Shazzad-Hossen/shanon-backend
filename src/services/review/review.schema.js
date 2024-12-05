const { model, Schema } = require("mongoose");
const paginate = require('mongoose-paginate-v2');


const schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref:'User'},
  product: {type: Schema.Types.ObjectId, ref:'Product'},
  rating: { type: Number, required:true, default: 0 },
  comment: {type: String, required: true }

 
}, { timestamps: true });
schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
 
  return JSON.parse(JSON.stringify(obj));
};

module.exports= model('Review', schema);