var mysql = require('mysql')
const dotenv = require("dotenv");
dotenv.config();

var db = mysql.createPool({
    connectionLimit: 10,
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    charset: 'UTF8MB4_GENERAL_CI'
})
db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }    if (connection) connection.release()    
    return
})
module.exports = db