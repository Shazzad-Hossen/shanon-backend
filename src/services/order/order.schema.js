const { model, Schema } = require("mongoose");
const paginate = require('mongoose-paginate-v2');
const Counter = require('../counter/counter.schema')


const schema = new Schema({
user: { type: Schema.Types.ObjectId, ref: 'User'},
status:{ type: String, enum:['pending','processing','delivered'], default:'pending'},
region: { type: Schema.Types.ObjectId, ref: 'Region'},
city: { type: Schema.Types.ObjectId, ref: 'City'},
area: { type: Schema.Types.ObjectId, ref: 'Area'},
name: { type: String, required: true},
address: { type: String, required: true},
phone: { type: String, required: true},
items: [
    {
        product:{type:Schema.Types.ObjectId, ref:'Product'},
        variant:{type: String},
        quantity:{type: Number},
    }
],
orderId: { type: Number, unique: true },


}, { timestamps: true });

schema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'orderId' }, // Query to find the counter
                { $inc: { seq: 1 } }, // Increment the seq field
                { new: true, upsert: true } // Create the document if it doesn't exist
            );
            this.orderId = counter.seq; // Assign the incremented value to orderId
        } catch (error) {
            return next(error); // Pass the error to the next middleware
        }
    }
    next();
});
schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.updatedAt;
 
  return JSON.parse(JSON.stringify(obj));
};

module.exports= model('Order', schema);