const regulationsService = require('../models/services/regulationsService');

exports.displayListRegulations = async(req, res, next)=>{
    const parameter = await regulationsService.getListParameters();
    res.render('regulations/listRegulations', {parameter});
}

exports.edit = async (req, res, next) => {
    try {
        await regulationsService.editRegulation(req, res, next);
        res.redirect("/list-regulations");
    } catch (err) {
        next(err);
    }
};
