const { auth, checkRole } = require("../middlewares");
const { getMessages, createMessage, getSingleMessage, deleteMessage, updateMessage } = require("./message.entity");


function message (){
    this.route.post('/message',createMessage(this));
    this.route.get('/message',auth, checkRole(['admin','super-admin']),getMessages(this));
    this.route.get('/message/:id',auth, checkRole(['admin','super-admin']),getSingleMessage(this));
    this.route.patch('/message/',auth, checkRole(['admin','super-admin']),updateMessage(this));
    this.route.delete('/message/:id',auth, checkRole(['admin','super-admin']), deleteMessage(this));
    
   


}

module.exports=message;