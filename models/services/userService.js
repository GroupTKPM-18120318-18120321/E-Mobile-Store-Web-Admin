const mongoose= require('mongoose');

const accountModel = require('../mongoose/accountModel');
const roleModel = require('../mongoose/roleModel');
const parameterModel = require('../mongoose/parameterModel');

exports.getUserAccountQuantity = async () => {
    const total = await accountModel.find({});
    const admin = await accountModel.find({role: mongoose.Types.ObjectId("5fe9b565ea0d1f18102eed2c")});
    const user = total.length - admin.length - 1;
    const lockedAcc = await accountModel.find({accountState: 1});
    return {
        total: total.length,
        admin: admin.length,
        user: user,
        lockedAcc: lockedAcc.length
    };
}

exports.getListAccounts = async (req, res, next) => {
    //const listAccs = await accountModel.find({});
    const page = +req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * 10;

    const listAccs = await accountModel.find({}, null, { lean: true })
        .populate({ path: "role", model: "Role" }).skip(offset).limit(limit)
        .exec().then((docs) => {
            return docs;
        });

    const newListAccs = [];
    listAccs.forEach((account) => {
        const accRole = {
            user: account.role.roleName === "User",
            admin: account.role.roleName === "Admin",
            superAdmin: account.role.roleName === "superAdmin"
        }

        newListAccs.push({ account, accRole });
    })

    //const data = listAccs.push(accRole);
    const userAccount = await this.getUserAccountQuantity();
    return {
        newListAccs: newListAccs,
        userAccount: userAccount
    };
}

exports.checkUnlockDate = async (_id, lockDate) => {
    const nowDate = new Date();
    const val = await parameterModel.parameterModel.findById("60c4dbc38883d632fcc11a07");

    if (nowDate.getTime() >= (lockDate.getTime() + val * 24 * 60 * 60 * 1000)) {
        console.log("Duoc phep truy cap");
        await accountModel.findByIdAndUpdate(_id, {accountState: 0});
        return true;
    }
    return false;
}

exports.changeAccountState = async (req, res, next) => {
    if (req.query.id != req.query.myAccountID) {
        let data;
        if (Number(req.query.accountState)){
            data = {
                accountState: 0,
                //lockDate = new Date(2021)
            }
        } else {
            data = {
                accountState: 1,
                lockDate: Date.now()
            }
        }

        await accountModel.findOneAndUpdate({ _id: req.query.id }, data, {new: true});
    }

    const account = await accountModel.findOne({ _id: req.query.id })
        .populate({ path: "role", model: "Role" })
        .exec().then((docs) => {
            return docs;
        });

    const accRole = {
        user: account.role.roleName === "User",
        admin: account.role.roleName === "Admin",
        superAdmin: account.role.roleName === "superAdmin"
    }

    const acc = { account, accRole };
    return acc;
}

exports.display = async (req, res, next) => {
    const info = await accountModel.findOne({ _id: req.params.id });
    return info;
}

exports.changeAccountRole = async (req, res, next) => {
    if (req.query.id != req.query.myAccountID) {
        let newRole;
        if (req.query.accountRole === "Admin") {
            newRole = "User";
        } else {
            newRole = "Admin"
        }

        const roleID = await roleModel.findOne({ roleName: newRole });
        //console.log("roleID: " + roleID);

        await accountModel.findOneAndUpdate({ _id: req.query.id }, {
            role: roleID._id
        });
    }

    const account = await accountModel.findOne({ _id: req.query.id })
        .populate({ path: "role", model: "Role" })
        .exec().then((docs) => {
            return docs;
        });

    const roleName = account.role.roleName;

    const accRole = {
        user: roleName === "User",
        admin: roleName === "Admin",
        superAdmin: roleName === "superAdmin"
    }

    const acc = { account, accRole };
    //console.log("acc: " + acc);
    return acc;
}

exports.count = async () => {
    return await accountModel.countDocuments();
}