var express = require('express');
var router = express.Router();
const productController= require('../controllers/productsController');

router.get('/add-new-product', productController.displayAddProduct);

router.post('/add-new-product', productController.addProductToDatabase);

router.get('/edit/:id', productController.displayEdit);

router.put('/edit/:id', productController.edit);

router.get('/delete/:id', productController.delete);

router.get('/branch/:nameManufacturer', productController.product);

router.get('/view/:id', productController.viewProduct);

/* GET List products table. */
router.get('/', productController.product);

module.exports = router;