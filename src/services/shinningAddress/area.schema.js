const { model, Schema } = require("mongoose");
const paginate = require('mongoose-paginate-v2');


const schema = new Schema({
 city: { type: Schema.Types.ObjectId, ref:'City' },
 region: { type: Schema.Types.ObjectId, ref:'Region' },
 name: { type: String, required: true,  },
 id: { type: String, required: true, unique: true },
}, { timestamps: true });
schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
 
  return JSON.parse(JSON.stringify(obj));
};

module.exports= model('Area', schema);