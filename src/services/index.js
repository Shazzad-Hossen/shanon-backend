
const category = require("./category/category");
const color = require("./color/color");
const demo = require("./demo/demo");
const file = require("./file/file");
const product = require("./product/product");
const review = require("./review/review");
const subCategory = require("./subcategory/subcategory");
const user = require("./user/user");
const shinningAddress = require("./shinningAddress/shinningAddress");



module.exports= (app) => {
    app.configure(demo);
    app.configure(user);
    app.configure(category);
    app.configure(subCategory);
    app.configure(color);
    app.configure(product);
    app.configure(file);
    app.configure(review);
    app.configure(shinningAddress);
    

    
    

  };