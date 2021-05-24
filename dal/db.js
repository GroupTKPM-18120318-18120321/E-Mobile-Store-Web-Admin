// const { config } = require("dotenv/types");
const mongoose=require("mongoose");
require('dotenv').config()
require('../models/mongoose/roleModel');

const uri = "mongodb+srv://hexad:%23Dd18212227@cluster0.ecnii.mongodb.net/StoreManager?retryWrites=true&w=majority";

const connectDB = async()=>{
    try {
        await mongoose.connect(uri,{
            useCreateIndex:true,
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useFindAndModify:false
        });
        console.log("Connect successful");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDB 