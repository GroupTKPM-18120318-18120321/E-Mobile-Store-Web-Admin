const revenueService = require('../models/services/revenueService');

exports.displayMonthRevenue = async(req, res, next) => {
    if(req.user){
        const result = await revenueService.displayChartAndMonthRevenue(req);
        res.render('index', result);
    } else {
        res.redirect('/login');
    }
}