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
        password: '',
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
// * CANDIDATES REQUESTS * //
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                    AS party_name 
                    FROM candidates 
                    LEFT JOIN parties 
                    ON candidates.party_id = parties.id`;


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
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id 
                WHERE candidates.id = ?`;
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

//Update candidates party
app.put('/api/candidates/:id', (req, res) =>{

    //uses checkInput() that was provided
    const errors = inputCheck(req.body, 'party_id');    

    if(errors){
        res.status(400).json({ error: errors});
    }

    const sql = `UPDATE candidates SET party_id = ? WHERE id = ?`;

    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) =>{
        if(err){
        res.status(400).json({ error: err.message });
        //check if a record was found
        }else if(!result.affectedRows){
            res.json({
                message: "Candidate not found"
            });
        }else{
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// * PARTIES REQUESTS * //
//Request to receive info about all parties
app.get('/api/parties', (req, res) =>{
    const sql = `SELECT * FROM parties`;

    db.query(sql, (err, rows) =>{
        if(err){
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message:'success',
            data: rows
        });
    });
});

//request to receive data about 1 party by ID
app.get('/api/parties/:id', (req, res) =>{
    const sql = `SELECT * FROM parties WHERE id = ?`;

    const params = [req.params.id];

    db.query(sql, params, (err, row) =>{
        if(err){
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//Request to delete parties by ID
app.delete('/api/parties/:id', (req, res) =>{
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) =>{
        if(err){
            res.status(400).json({ error: res.message });
            //checks party exists
        }else if(!result.affectedRows){
            res.json({
                message: 'Party Not Found',
            });
        }else{
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
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
