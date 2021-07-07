const revenueService = require('../models/services/revenueService');

exports.displayMonthRevenue = async(req, res, next) => {
    try {
        if(req.user){
            const result = await revenueService.displayChartAndMonthRevenue(req, res, next);
            res.render('index', result);
        } else {
            res.redirect('/login');
        }
    } catch(err){
        next(err);
    }
    
}