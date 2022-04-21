const express = require('express');
const router = express.Router();

const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');



// GET all candidates
router.get('/candidates', (req, res) => {
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




//  GET Candidates by ID
//GET a single candidate
router.get('/candidates/:id', (req, res) => {
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


//  DELETE Candidates by ID
//Delete a candidate
router.delete('/candidates/:id', (req, res) => {
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

//  CREATE/POST Candidates by ID
//Create a candidate
//body is req.body
router.post('/candidates', ({ body }, res) => {
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

// UPDATE/PUT Candidates by ID
//Update candidates party
router.put('/candidates/:id', (req, res) =>{

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


module.exports = router;