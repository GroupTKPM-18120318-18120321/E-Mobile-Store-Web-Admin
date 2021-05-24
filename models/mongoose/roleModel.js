const mongoose= require('mongoose');
const Schema = mongoose.Schema();

//Tạo model
const roleSchema = mongoose.Schema({
   roleName: {type: String, required: true}
})

module.exports = mongoose.model('Role', roleSchema, "Role" )