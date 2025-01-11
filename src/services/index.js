
const category = require("./category/category");
const color = require("./color/color");
const demo = require("./demo/demo");
const file = require("./file/file");
const product = require("./product/product");
const review = require("./review/review");
const subCategory = require("./subcategory/subcategory");
const user = require("./user/user");
const shinningAddress = require("./shinningAddress/shinningAddress");
const order = require("./order/order");
const banner = require("./banner/banner");
const dashboard = require("./dashboard/dashboard");
const content = require("./content/content");
const message = require("./message/message");
const cart = require("./cart/cart");
const favourite = require("./favourite/favourite");
const brand = require("./brands/brands");



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
    app.configure(order);
    app.configure(banner);
    app.configure(dashboard);
    app.configure(content);
    app.configure(message);
    app.configure(cart);
    app.configure(favourite);
    app.configure(brand);
    

    
    

    
    

  };