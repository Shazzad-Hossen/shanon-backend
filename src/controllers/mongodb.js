const { default: mongoose } = require("mongoose")

module.exports.connectDB=async function(settings){
return new Promise((resolve, reject)=>{
    try {
        mongoose.connect(settings.DB_URL);
        resolve('=> MongoDB connected');
        
    } catch (error) {
        console.log(error)
        reject();
        
    }
})
}