module.exports = {
    useHTTP2:true,
    origin:["*",'http://localhost:5173','http://localhost:4000'],
    DB_URL: process.env.MONGODB_URL,
    PORT: process.env.PORT || 4000,
    SECRET: 'b2f23561bb2eff865a02bf58f37028c13d0687c0393eedb3b8afacd530dda7ef:2cf1c03bb1ecdc9e1376b27d488bb9c2',
    COOKIE_NAME:'SHANON'

}