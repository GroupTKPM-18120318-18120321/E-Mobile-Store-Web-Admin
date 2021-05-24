const e = require('express');
const manufacturerModel=require('../mongoose/manufacturerModel');

exports.findOne = async(filter) =>{
    const manufacturer= await manufacturerModel.findOne(filter);
    return manufacturer;
}

exports.add = async(req, res, next)=>{
    const newManufacturer = new manufacturerModel({manufacturer: req.body.newManufacturer});
    //console.log(newManufacturer);
    await newManufacturer.save();
}

exports.rename = async(req, res, next)=>{
    //console.log(req.body.manufacturerId);
    //console.log(req.body.newManufacturerName)
    await manufacturerModel.findOneAndUpdate({_id: req.body.manufacturerId}, {manufacturer: req.body.newManufacturerName}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Err Rename: " + err);
        };
    });
}

exports.getListManufacturer = async (req, res, next) => {
    const manufacturer = await manufacturerModel.find();
    //console.log(manufacturer);
    return manufacturer;
}

exports.getListManufacturerHaveSelected = async (req, res, next) => {
    const manufacturers = await manufacturerModel.find();
    const newListManufacturer = [];

    manufacturers.forEach((temp) => {
        newListManufacturer.push({
            _id:temp._id.toString(),
            manufacturer: temp.manufacturer,
            isSelected: temp._id.toString() === req._id.toString()
        });
    })

    return newListManufacturer;
}
