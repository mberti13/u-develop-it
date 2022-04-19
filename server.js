//imports mysql2
const mysql = require('mysql2');

//imports express into server file
const express = require('express');
const res = require('express/lib/response');


//sets the port designation for hosting on server
const PORT = process.env.PORT || 3001;

//sets express equal to app
const app = express();

//Express Middleware
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

//Connects application to MySQL Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //MySQL Username
        user: 'root',
        //MySQL Password
        password: 'BIwuHz6fUc+3k6@oFDQMV1wECxS%D=',
        database: 'election'
    },
    console.log('Connected to the election database.')
);



//TEST GET ROUTE
// app.get('/', (req,res) =>{
//     res.json({
//         message: 'Hello World'
//     });
// });


// ****QUERIES****
//Runs SQL Query and executes callback with all resulting rows that match query
//If there are no errors, err is null, THIS IS KEY!!!
// db.query(`SELECT * FROM candidates`, (err, rows) =>{
//     console.log(rows);
// });

//GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = ?`, 1, (err, row) =>{
//     if(err){
//         console.log(err);
//     }

//     console.log(row);

// });

//Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) =>{
//     if(err){
//         console.log(err);
//     }

//     console.log(result);

// });

//Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
                VALUES (?,?,?,?)`;

const params = [1, 'Ronald', 'Firman', 1];

db.query(sql,params, (err, result) =>{
    if(err){
        console.log(err)
    }

    console.log(result);

});


//Default Response for any other request(Not Found)
//CATCHALL ROUTE
app.use((req,res) =>{
    res.status(404).end()
});

//Function to start server on port 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});
