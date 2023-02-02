const {createPOOL} = require("mysql2/promise");

/*
* se utilizara para la comunicacion con la base de datos
*/
const POOL = createPOOL({
    host:"localhost",
    user:"root",
    password:"root",
    port:8888,
    database:"eStore",
    socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'
});

module.exports = POOL;