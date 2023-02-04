const {createPool} = require("mysql2/promise");

/*
* se utilizara para la comunicacion con la base de datos
*/
const POOL = createPool({
    host:"puntopollo.com.mialias.net",
    user:"pepelmago",
    password:"pepe123456",
    database:"estorepollos"
});

module.exports = POOL;