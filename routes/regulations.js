const express = require('express');
const router = express.Router();

const regulationsController = require('../controllers/regulationsController');

router.put('/edit/:id', regulationsController.edit);

//router.get('/edit/:id', productController.displayEdit);

router.get('/', regulationsController.displayListRegulations);

module.exports = router;