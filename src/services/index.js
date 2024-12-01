
const category = require("./category/category");
const color = require("./color/color");
const demo = require("./demo/demo");
const subCategory = require("./subcategory/subcategory");
const user = require("./user/user");



module.exports= (app) => {
    app.configure(demo);
    app.configure(user);
    app.configure(category);
    app.configure(subCategory);
    app.configure(color);
    

    
    

  };