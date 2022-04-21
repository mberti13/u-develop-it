//imports mysql2
const mysql = require('mysql2');

//Connects application to MySQL Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //MySQL Username
        user: 'root',
        //MySQL Password
        password: '',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;