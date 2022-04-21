const express = require('express');
const router = express.Router();

const db = require('../../db/connection');


// * PARTIES REQUESTS * //
//Request to receive info about all parties
// * GET *ALL* parties
router.get('/parties', (req, res) =>{
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

// * GET parties by ID
//request to receive data about 1 party by ID
router.get('/parties/:id', (req, res) =>{
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

// * DELETE parties by ID
//Request to delete parties by ID
router.delete('/parties/:id', (req, res) =>{
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

module.exports = router;