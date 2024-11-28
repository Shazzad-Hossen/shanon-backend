require('dotenv').config();
const settings = require("../settings");
const App = require("./app");
const { connectDB } = require("./controllers/mongodb");
const path= require('node:path');
const fs= require('node:fs');

const deps=[
    {
        method: connectDB,
        args:[settings]
    }
];

(async()=>{
    const statics = path.resolve(process.cwd(), 'client');
    if (!fs.existsSync(statics)) {
      fs.mkdirSync(statics);
    }

    const app = new App({deps});
    await app.start();

})();