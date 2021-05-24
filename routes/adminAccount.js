var express = require('express');
var router = express.Router();
const adminAccountController = require('../controllers/adminAccountController');

//Get
router.get('/:id', adminAccountController.displayAccInfo);

router.put('/:id', adminAccountController.changeAvatar);

router.put('/edit/:id', adminAccountController.editInfo);

router.put('/edit/change-password/:id', adminAccountController.changePassword, adminAccountController.setActiveChangePasswordTab);

module.exports = router;