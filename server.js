//imports mysql2
const mysql = require('mysql2');

//imports express into server file
const express = require('express');
const res = require('express/lib/response');
const { param } = require('express/lib/request');
const inputCheck = require('./utils/inputCheck');


//sets the port designation for hosting on server
const PORT = process.env.PORT || 3001;

//sets express equal to app
const app = express();

//Express Middleware
app.use(express.urlencoded({ extended: false }));
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
//GET all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;


    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });

            return;

        }

        res.json({
            message: 'success',
            data: rows
        });

    });
});




//GET a single candidate
app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: row
        });

    });

});



//Delete a candidate
app.delete('/api/candidates/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    //names id from results in array
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if
            //if candidate doesn't exist
            (!result.affectedRows) {
            res.json({
                message: 'Candidate not found!'
            });
        } else {
            res.json({
                message: 'Successfully deleted!',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


//Create a candidate
//body is req.body
app.post('/api/candidates', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});



//Default Response for any other request(Not Found)
//CATCHALL ROUTE
app.use((req, res) => {
    res.status(404).end()
});

//Function to start server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
