const usersService = require('../models/services/userService');

exports.displayListAccounts = async (req, res, next) => {
    const accounts = await usersService.getListAccounts(req, res, next);
    const page=+req.query.page || 1;
    const limit =10;
    const offset =(page -1)*10;

    const numPage= Math.ceil((await usersService.count())/limit);

    const pageItem=[]
    for(let i=1;i<=numPage;i++){
        const items={
            value:i,
            isActive:i===page
        }
        pageItem.push(items);
    }

    res.render('userAccounts/listAccounts', {
        accounts,
        pageItem: pageItem,
        isPagination: numPage>=2, 
        prevPage: page>=2?page-1:1, 
        nextPage: page>=numPage?numPage:page+1,
        canGoPrev: page>=2,
        canGoNext: page<=numPage-1,
    });
}

exports.changeAccountState = async (req,res,next)=>{
    const account = await usersService.changeAccountState(req, res, next);
    //console.log(account);
    res.json(account);
}

exports.displayDetailInfo = async (req, res, next) => {
    const accountInfo = await usersService.display(req, res, next);
    res.render('userAccounts/accountDetail', {accountInfo});
}

exports.changeAccountRole = async (req,res,next)=>{
    const account = await usersService.changeAccountRole(req, res, next);
    console.log("role: " + account);
    res.json(account);
}

