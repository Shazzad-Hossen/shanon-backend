const { auth } = require("../middlewares");
const { addFavourite, getFavourites, removeFavourite, crearFavourite } = require("./favourite.entity");


function favourite (){
    this.route.post('/favourite',auth,addFavourite(this));
    this.route.get('/favourite',auth,getFavourites(this));
    this.route.patch('/favourite/:id',auth,removeFavourite(this));
    this.route.delete('/favourite',auth,removeFavourite(this));
}

module.exports=favourite;