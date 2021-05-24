const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.get('/', ordersController.displayListOrders);

router.get('/order-detail/:id', ordersController.viewOrderDetail);

module.exports = router;