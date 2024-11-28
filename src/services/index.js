
const category = require("./category/category");
const demo = require("./demo/demo");
const user = require("./user/user");



module.exports= (app) => {
    app.configure(demo);
    app.configure(user);
    app.configure(category);

    
    

  };