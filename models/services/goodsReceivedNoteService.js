require("dotenv").config();
const formidable = require('formidable');
const mongoose = require('mongoose');

const goodsReceivedNoteModel = require('../mongoose/goodsReceivedNoteModel');
const productsService = require('./productsService');
const revenueService = require('./revenueService');

exports.addGoodsReceivedNoteToDB = async (req, res, next) => {
    const form = formidable({ multiples: true, maxFileSize: 20 * 1024 * 1024 });
    let _id = "";
    let postData = "";

    const id = await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            postData = fields;

            //Them phieu nhap hang
            const data = {
                idListGoodsReceivedNote: mongoose.Types.ObjectId('60bde3161d2852f28c95fec9'),
                totalPrice: fields.totalPrice
            }

            const newGoodsReceivedNote = new goodsReceivedNoteModel.goodsReceivedNoteModel(data);

            //Lay id phieu nhap hang
            _id = newGoodsReceivedNote._id;

            await newGoodsReceivedNote.save();

            resolve(_id);
        });
    });

    //Cập nhật doanh thu trong ngày
    const data = await goodsReceivedNoteModel.goodsReceivedNoteModel.findById(id);
    await revenueService.updateDateRevenueWithGoodsReceivedNote(data.date, data.totalPrice);

    //Them chi tiet phieu nhap hang
    await new Promise(async (resolve, reject) => {
        //So luong san pham trong phieu nhap hang
        const size = postData.sizeNote;

        for (let i = 1; i <= size; i++) {
            const product = {
                idGoodsReceivedNote: mongoose.Types.ObjectId(_id),
                idProduct: postData["idProduct" + i],
                quantity: postData["quantity" + i],
                productPrice: postData["productPrice" + i],//Gia nhap cua san pham
                totalPriceOneProduct: postData["totalPriceOneProduct" + i],
            };

            const newGoodsReceivedNoteDetail = new goodsReceivedNoteModel.goodsReceivedNoteDetailModel(product);
            await newGoodsReceivedNoteDetail.save();
            //Cập nhật số lượng sản phẩm
            await productsService.updateProductQuantity(product.idProduct, product.quantity);
        }

        resolve();
    });
}

// month, year: Number
// month: [1,12]
exports.getGoodsReceivedNoteInMonth = async (month, year) => {
    const startDate = new Date(year + "-" + month + "-" + 1);
    const endDate = new Date(year, month, 0);
    const end = endDate.getDate();
    let result = [];

    for (let i = 0; i < end; i++) {
        result.push({ totalPrice: 0 });
    }

    const query = {
        date: {
            $gte: startDate,
            $lt: endDate
        }
    };

    const goodsReceivedNote = await goodsReceivedNoteModel.goodsReceivedNoteModel.find(query);

    for (let i = 0; i < goodsReceivedNote.length; i++) {
        result[goodsReceivedNote[i].date.getDate() - 1].totalPrice = goodsReceivedNote[i].totalPrice;//Check lại về ngày
    }

    return result;
}