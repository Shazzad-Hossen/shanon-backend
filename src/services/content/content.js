const { auth, checkRole } = require("../middlewares");
const { updateContent, getContent } = require("./content.entity");


function content (){
    this.route.get('/content',getContent(this));
    this.route.post('/content',auth, checkRole(['super-admin']),updateContent(this));
   


}

module.exports=content;