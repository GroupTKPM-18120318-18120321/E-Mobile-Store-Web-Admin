const adminAccountService = require('../models/services/adminAccountService');
const accountModel = require('../models/mongoose/accountModel');

exports.displayAccInfo = async (req, res, next) => {
    try {
        if (!req.user) {
            res.redirect('/login');
        }
        else {
            const accountInfo = await adminAccountService.getAccInfo(req, res, next);
            const genderSelector = await adminAccountService.getSelectedGender(req, res, next);
            res.render('adminAccount/adminProfile', { accountInfo, genderSelector, setActiveChangePassTab: false });
        }
    } catch (err) {
        next(err);
    }
}

exports.changeAvatar = async (req, res, next) => {
    try {
        await adminAccountService.changeAvt(req, res, next);
        const url = '/my-account/' + req.params.id;

        res.redirect(url);
    } catch (err) {
        next(err);
    }
}

exports.displayLogin = async (req, res, next) => {
    let message = "";
    message = await req.flash('error');
    //console.log("req.query.to");
    //console.log(req.body);
    //console.log("message: " + message);
    if (message != "") {
        //console.log(message);
        res.render('adminAccount/login', { message, notify: 'block' });
    }
    else {
        res.render('adminAccount/login', { notify: 'none' });
    }
}

exports.editInfo = async (req, res, next) => {
    try {
        await adminAccountService.editInfo(req, res, next);
        const url = '/my-account/' + req.params.id;

        res.redirect(url);
    } catch (err) {
        next(err);
    }
}

exports.setActiveChangePasswordTab = async (req, res, next) => {
    const accountInfo = await accountModel.findOne({ _id: req.params.id });
    res.render("adminAccount/adminProfile", { accountInfo, setActiveChangePassTab: true });
}

exports.changePassword = async (req, res, next) => {
    try {
        const oldPassword = await adminAccountService.changePass(req, res, next);

        if (oldPassword) {
            const url = '/my-account/' + req.params.id;
            res.redirect(url);
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        let error = new Error("Not found");
        error.status = 404;
        res.render('error', {error});
    }
}