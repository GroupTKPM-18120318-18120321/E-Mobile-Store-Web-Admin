require("dotenv").config();
const formidable = require('formidable');
const path = require('path');
const mv = require('mv');
const cloudinary = require('cloudinary').v2; 
const fse = require('fs-extra');

cloudinary.config({
    cloud_name: 'hexadstore',
    api_key: "616475942262733",
    api_secret: "Cn2TDpeyyCBaLJr5ck5jB1i8d-g"
})

const productModel = require('../mongoose/productsModel');
const { resolve } = require('path');

//Get list of products
exports.list = async () => {
    const result = await productModel.find({});
    return result;
}

exports.find = async (filter) => {
    const result = await productModel.find(filter);
    return result;
}

exports.findOne = async (filter) => {
    const result = await productModel.findOne(filter);
    console.log(result);
    return result;
}

//Upload and get a image link
exports.uploadImg = async (coverImg, cloudinaryFolder,res, next) => {
    //const fileName = coverImg.path.split('\\').pop() + '.' + coverImg.name.split('.').pop();
    
    //const filePath = path.join(__dirname, '/../public/img/products/upload/' + fileName);
    //const filePath = path.join(__dirname, '/../public/img/' + file_path + fileName);
    //console.log("filePath: " + filePath);
    // mv(coverImg.path, filePath, function(err) {
    //     if (err) throw err;
    // });

    //Delete temp files
    fse.remove(coverImg.path, err => {
        if (err) return console.error(err);
        console.log('success!');
    })

    //Upload cover image to server
    // const publicID = 'products/' + coverImg.path.split('\\').pop();
    const publicID = cloudinaryFolder + '/' + coverImg.path.split('\\').pop();
    await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(coverImg.path, { public_id: publicID}, (err, result) => {
            if (err) {
                return reject(err);
            }
            //console.log(return cloudinary.url(publicID););
            resolve();
            //return resolve(result);
        });
    });

    return cloudinary.url(publicID);
}

exports.uploadImgs = async(files, cloudinaryFolder, res, next)=>{
    let imgLinkArr = [];

    //Detail images
    for (let i = 0; i < files.length; i++){
        if (files[i].size > 0){
            imgLinkArr.push(await this.uploadImg(files[i], cloudinaryFolder));
        }
    } 

    return imgLinkArr; 
}

//Add new product
exports.addNewProduct = async (req, res, next) => {
    const form = formidable({ multiples: true, maxFileSize: 20*1024*1024 });
    
    await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            
            const coverImg = files.filename;
            //console.log(coverImg.path);

            if (coverImg && coverImg.size > 0){
                const mainImgLink = await this.uploadImg(coverImg, 'products');     
                const imgLinkArr = await this.uploadImgs(files.filenameArr, 'products');

                console.log("arr: " + imgLinkArr);
                const newPostData = {
                    name: fields.productName,
                    baseprice: fields.productBasePrice,
                    discountprice:fields.productDiscountPrice,
                    cover: mainImgLink,
                    detailImgs: imgLinkArr,
                    idmanufacturer: fields.manufacturer,
                    battery: fields.productBattery,
                    camera: fields.productCamera,
                    processor: fields.productProcessor,
                    screen: fields.productScreen,
                    storage: fields.productStorage,

                    quantityAvailable: fields.quantityAvailable,
                    description: fields.description,
                    //releaseDay: Date.now(),
                    //DeletedState: 0
                };

                const newProduct = new productModel(newPostData);
                console.log("new product: \n" + newProduct);
                await newProduct.save();
                console.log("Save successful!");             
            }
          
            resolve();
        });
    });
}

//Edit product
exports.editProduct = async (req, res, next) => {
    const form = formidable({ multiples: true, maxFileSize: 20*1024*1024 });
    
    await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                reject(err);
                //return;
            }
   
            const mainImg = files.filename;
            const detailImg = files.filenameArr;

            const editData = {
                name: fields.productName,
                baseprice: fields.productBasePrice,
                discountprice:fields.productDiscountPrice,
                //cover: mainImgLink,
                //detailImgs: detailImgLink,
                idmanufacturer: fields.manufacturer,
                battery: fields.productBattery,
                camera: fields.productCamera,
                processor: fields.productProcessor,
                screen: fields.productScreen,
                storage: fields.productStorage,

                quantityAvailable: fields.quantityAvailable,
                description: fields.description,
                //releaseDay: Date.now(),
                //DeletedState: 0
            };

            //let mainImgLink;
            //let detailImgLink;
            
            if (mainImg && mainImg.size > 0){
                console.log("mainImg");
                await this.uploadImg(mainImg, 'products')
                    .then((mainImgLink)=>{
                        editData.cover = mainImgLink;
                    });
            }

            if (detailImg && detailImg.length > 0){
                console.log("detailImg");
                await this.uploadImgs(detailImg, 'products')
                    .then((detailImgLink)=>{
                        editData.detailImgs = detailImgLink;
                    })
                
            }
            //console.log(editData);

            const IDQuery = fields.productID;
            await productModel.findOneAndUpdate({_id: IDQuery}, editData, {new: true}, (err, doc) => {
                if (err) reject(err);
            });
          
            resolve();
        });
    });
}

exports.deleteProduct=async (filter)=>{
    await productModel.findOneAndDelete(filter);
}

exports.listProduct = async(filter, limit, offset) =>{
    const option={
        offset: offset,
        limit: limit,
    }
    const product = await productModel.paginate(filter,option,);

    return product;
}
