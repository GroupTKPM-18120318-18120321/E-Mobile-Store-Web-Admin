const usersService = require('../models/services/userService');

exports.displayListAccounts = async (req, res, next) => {
    let data = await usersService.getListAccounts(req, res, next);
    let accounts = data.newListAccs;
    let userAccount = data.userAccount;
    
    let page = +req.query.page || 1;
    if (page < 0) page = 1;

    const limit = 10;
    const offset = (page - 1) * 10;

    const numPage = Math.ceil((await usersService.count()) / limit);

    if (page > numPage) {
        page = numPage;
        req.query.page = page;
        data = await usersService.getListAccounts(req, res, next);
        accounts = data.newListAccs;
        userAccount = data.userAccount;
        numPage = Math.ceil((await ordersService.countListOrder()) / limit);
    }

    const pageItem = []
    for (let i = 1; i <= numPage; i++) {
        const items = {
            value: i,
            isActive: i === page
        }
        pageItem.push(items);
    }

    res.render('userAccounts/listAccounts', {
        accounts,
        userAccount,
        pageItem: pageItem,
        isPagination: numPage >= 2,
        prevPage: page >= 2 ? page - 1 : 1,
        nextPage: page >= numPage ? numPage : page + 1,
        canGoPrev: page >= 2,
        canGoNext: page <= numPage - 1,
    });
}

exports.changeAccountState = async (req, res, next) => {
    try {
        const account = await usersService.changeAccountState(req, res, next);
        //console.log(account);
        if (account == null) {
            let err = new Error("Not found");
            err.status = 404;
            throw err;
        }
        res.json(account);
    } catch (err) {
        next(err);
    }

}

exports.displayDetailInfo = async (req, res, next) => {
    try {
        const accountInfo = await usersService.display(req, res, next);
        if (accountInfo == null) {
            let err = new Error("Not found");
            err.status = 404;
            throw err;
        } else {
            res.render('userAccounts/accountDetail', { accountInfo });
        }
    } catch (err) {
        next(err);
    }
}

exports.changeAccountRole = async (req, res, next) => {
    try {
        const account = await usersService.changeAccountRole(req, res, next);
        //console.log("role: " + account);
        if (account == null) {
            let err = new Error("Not found");
            err.status = 404;
            throw err;
        } else {
            res.json(account);
        }
    } catch (err) {
        next(err);
    }

}

exports.getAccountQuantity = async (req, res, next) => {
    const result = await usersService.getUserAccountQuantity();
    res.json(result);
}

