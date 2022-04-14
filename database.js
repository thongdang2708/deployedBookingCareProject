const Pool = require('pg').Pool;

const pool = new Pool({
    user : "postgres",
    host : "localhost",
    database : "postgres",
    password : "1998",
    port : 5432
})

module.exports = pool;