const express = require('express');
const router = express.Router();

const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// * GET for all voters
router.get('/voters', (req, res) =>{
    const sql = `SELECT * FROM voters ORDER BY last_name`;

    db.query(sql, (err, rows) =>{
        if(err){
            res.status(500).json({ error: err.message });
            return
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// * Get single voter by ID
// router.get('/voters', (req, res) =>{
//     const sql = 
// })

module.exports = router;