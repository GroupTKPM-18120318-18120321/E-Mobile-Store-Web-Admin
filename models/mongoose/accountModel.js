const mongoose= require('mongoose');
const Schema = mongoose.Schema();
const mongoosePaginate = require('mongoose-paginate-v2');

//Tạo model
const accountSchema = mongoose.Schema({
    name: {type: String, require: true},//Tên đăng nhập
    userName: {type: String, require: true},//Họ tên
    password: {type: String, require: true},
    email: {type: String, require: true},
    phoneNumber: {type: String, require: true},  
    avatar: {type: String},
    address: {type: String, require: true},
    accountState:{type: Number,  enum: [0,1], default: 0},
    id : {type: String, require: true},
    token : {type: String, require: true},
    role: {type: mongoose.Schema.Types.ObjectId , require: true, ref: "Role"},
    DoB: {type: String},
    gender: {type: String, enum: ['Nam', 'Nữ', 'Khác'], require: true}
})

accountSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Account',  accountSchema, "users" )
