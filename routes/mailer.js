const express = require('express');
const router = express.Router();
const mailerController = require('../controllers/mailerController');
//const checkLocalUserMiddleware = require('../middleware/checkLocalUser');

router.get('/send', mailerController.sendmail);

router.get('/verify', mailerController.displayFormAuth);

router.post('/verify', mailerController.checkFormAuth);

router.get('/forgot-password', mailerController.displayFormInputEmail);

router.post('/forgot-password', mailerController.checkEmail);

router.get('/change-password', mailerController.displayFormChangePassword);

router.post('/change-password', mailerController.changePassword);

// router.get('/verify', function (req, res) {
//     console.log(req.protocol + ":/" + req.get('Host'));
//     if ((req.protocol + "://" + req.get('Host')) == ("http://" + Host)) {
//         console.log("Domain is matched. Information is from Authentic email");
//         if (req.query.id == Rand) {
//             console.log("email is verified");
//             res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
//         }
//         else {
//             console.log("email is not verified");
//             res.end("<h1>Bad Request</h1>");
//         }
//     }
//     else {
//         res.end("<h1>Request is from unknown source");
//     }
// });


module.exports = router;