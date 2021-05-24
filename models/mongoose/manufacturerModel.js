const mongoose= require('mongoose');
const Schema = mongoose.Schema();

//Tạo model
const manufacturerSchema = mongoose.Schema({
    //_id: {type: String },
    manufacturer: {type: String, require: true}
})

module.exports = mongoose.model('Manufacturer', manufacturerSchema, "Manufacturer" )
