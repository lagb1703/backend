const {createPool} = require("mysql2/promise");

const pool = createPool({
    host:"localhost",
    user:"root",
    password:"root",
    port:8888,
    database:"eStore",
    socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'
});

module.exports = pool;