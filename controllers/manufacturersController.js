const productsService = require('../models/services/productsService');
const manufacturersModel = require('../models/mongoose/manufacturerModel');
const manufacturerService = require('../models/services/manufacturerService');

exports.getListManufacturer = async (req, res, next) => {
    const manufacturers = await manufacturersModel.find({});
    res.render('manufacturers/listManufacturers', {manufacturers});
}

exports.addManufacturer = async (req, res, next) => {
    await manufacturerService.add(req, res, next);
    res.redirect('/list-manufacturers');
}

exports.renameManufacturer = async (req, res, next) => {
    await manufacturerService.rename(req, res, next);
    res.redirect('/list-manufacturers');
}

