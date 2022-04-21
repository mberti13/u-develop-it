const express = require('express');
const router = express.Router();

// * Use routes in candidateRoutes module
router.use(require('./candidateRoutes'));

// * Use routes in partyRoutes module
router.use(require('./partyRoutes'));

module.exports = router;