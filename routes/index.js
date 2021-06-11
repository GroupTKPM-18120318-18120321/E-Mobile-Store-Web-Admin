const express = require('express');
const router = express.Router();
const passport = require('../passport/passport');

const adminAccountController = require('../controllers/adminAccountController');
const revenueController = require('../controllers/revenueController');

/* GET home page. */
router.get('/', revenueController.displayMonthRevenue);

router.get('/login', adminAccountController.displayLogin);

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
