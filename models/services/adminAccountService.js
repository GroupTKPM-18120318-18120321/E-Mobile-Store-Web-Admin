const formidable = require('formidable');
const bcrypt = require('bcrypt');
const emailValidator = require('email-deep-validator');

const accountModel = require('../mongoose/accountModel');
const productsService = require('../services/productsService');
const { use } = require('passport');

const saltRounds = 10;
let accountdata = "abc";

exports.getAccInfo = async (req, res, next) => {
    const accountInfo = await accountModel.findOne({ _id: req.params.id });
    return accountInfo;
}

exports.editInfo = async (req, res, next) => {
    const info = req.body;

    const docs = {
        userName: info.userName,
        DoB: info.DoB,
        gender: info.gender,
        address: info.address,
        phoneNumber: info.phoneNumber,
        //email: info.email,
    };

    await accountModel.findOneAndUpdate({ _id: req.params.id }, docs, { new: true }, (err, doc) => {
        if (err) {
            console.log("Err Edit info: " + err);
        };
    });
}

exports.changeAvt = async (req, res, next) => {
    const form = formidable({ multiples: true });

    await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                reject(err);
            }

            const avatar = files.adminAvt;

            if (avatar && avatar.size > 0) {
                await productsService.uploadImg(avatar, 'adminAvts')
                    .then((avatarLink) => {
                        console.log("Link avt: " + avatarLink);
                        const IDQuery = fields._id;
                        const newAvatar = { avatar: avatarLink };
                        accountModel.findOneAndUpdate({ _id: IDQuery }, newAvatar, { new: true }, (err, doc) => {
                            if (err) reject(err);
                        });
                        console.log("Đổi avatar thành công");
                    });
            }

            resolve();
            return fields._id;
        });
    });
}

exports.changePass = async (req, res, next) => {
    const account = await accountModel.findOne({ _id: req.params.id });
    const data = req.body;
    let checkPassword = await bcrypt.compare(data.oldPassword, account.password);

    if (checkPassword) {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(data.newPassword, saltRounds, function (err, hash) {
                if (err) reject(err)
                resolve(hash)
            });
        })

        await accountModel.findOneAndUpdate({ _id: req.params.id }, { password: hashedPassword });
        return true;

    } else {
        return false;
    }
}

//-----Authentication-----

exports.findOne = async (key, value) => {
    var name = key;
    var value1 = value;
    var query = {};
    query[name] = value1;
    const user = await accountModel.findOne(query);

    //console.log(user);
    return user
}

exports.UpdatePassword = async (key, value, update) => {
    var name = key;
    var value1 = value;
    var query = {};
    query[name] = value1;
    const user = await accountModel.findOneAndUpdate(query, update);
    console.log("UPDATE PASSWORD")
    console.log(user);
    return user
}

exports.checkUser = async (username, password) => {
    const user = await accountModel.findOne({ name: username })


    if (!user) {
        return false;
    }

    let checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
        return user;
    }

    return false;
}

exports.getUser = async (id) => {
    return await accountModel.findOne({ _id: id })
        .populate({ path: "role", model: "Role" })
        .exec().then((docs) => {
            return docs;
        });
    
    
}

exports.saveTemporaryAccount = async (req, res, next) => {
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(req.body.Password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    accountdata = {
        name: req.body.Name,
        password: hashedPassword,
        email: req.body.Email,
        avatar: 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png',
    };
}

exports.getTemporaryAccount = (req, res, next) => {
    return accountdata;
}

exports.setTemporaryAccount = (req, res, next) => {
    accountdata = "abc";
}

//-----Authentication-----

exports.getSelectedGender = async (req, res, next) => {
    const genderEnum = ['Nam', 'Nữ', 'Khác'];
    const listGender = [];
    const account = await accountModel.findOne({ _id: req.params.id });

    for (let i = 0; i < 3; i++) {
        listGender.push({
            name: genderEnum[i],
            isSelected: genderEnum[i] === account.gender
        })
    }

    return listGender;
}