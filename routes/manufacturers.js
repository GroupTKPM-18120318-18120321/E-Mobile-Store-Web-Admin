var express = require('express');
var router = express.Router();
const manufacturerController = require('../controllers/manufacturersController');

router.get('/', manufacturerController.getListManufacturer);

router.post('/add', manufacturerController.addManufacturer);

router.put('/rename', manufacturerController.renameManufacturer);

module.exports = router;