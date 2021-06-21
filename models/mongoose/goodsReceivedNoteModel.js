const mongoose= require('mongoose');
const Schema = mongoose.Schema();
const mongoosePaginate = require('mongoose-paginate-v2');

const goodsReceivedNoteSchema = mongoose.Schema({
    idListGoodsReceivedNote: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'ListGoodsReceivedNote'},
    date: {type: Date, default: Date.now()},
    totalPrice: {type: Number, require: true}
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

const listGoodsReceivedNoteSchema = mongoose.Schema({

});

const goodsReceivedNoteDetailSchema = mongoose.Schema({
    idGoodsReceivedNote: {type: mongoose.Schema.Types.ObjectId , require: true, ref: 'GoodsReceivedNote'},
    idProduct: {type: mongoose.Schema.Types.ObjectId , require: true, ref: 'Product'},
    quantity: {type: Number, required: true},
    productPrice: {type: Number, required: true},//Gia nhap cua san pham
    totalPriceOneProduct: {type: Number, required: true},
});

//Format
const formatCurrency = (currency)=>{
    let result="";
    const arr=[];
    let tmp;
    do{
        tmp = currency % 1000;
        if (tmp == 0) {
            arr.unshift("000");
        } else if (tmp < 10) {
            arr.unshift("00" + tmp);
        } else if (tmp < 100) {
            arr.unshift("0" + tmp);
        } else {
            arr.unshift(tmp);
        }
        //arr.unshift(tmp==0?"000":tmp);
        currency = Math.floor(currency / 1000);
    } while (currency >= 1000);
    
    arr.unshift(currency);

    for(let i=0;i<arr.length;i++){
        result+=arr[i];
        result += i==arr.length-1 ? "" :".";
    }   

    return result;
}

goodsReceivedNoteSchema.virtual('ftotalPrice').get(function() {
    return formatCurrency(this.totalPrice); 
});

goodsReceivedNoteDetailSchema.virtual('ftotalPriceOneProduct').get(function() {
    return formatCurrency(this.totalPriceOneProduct); 
});

goodsReceivedNoteDetailSchema.virtual('fproductPrice').get(function() {
    return formatCurrency(this.productPrice); 
});


// orderSchema.virtual('deliveryTime').get(function() {
//     const time= new Date(this.orderDate);
//     const d = time.getDate();
//     const m =  time.getMonth() +1;
//     const y =  time.getFullYear(); 
//     return d + "-" + m + "-" + y;
// });

//orderSchema.plugin(mongoosePaginate);
//orderStatusSchema.plugin(mongoosePaginate);
//orderDetailSchema.plugin(mongoosePaginate);

const goodsReceivedNote = mongoose.model('GoodsReceivedNote', goodsReceivedNoteSchema, "GoodsReceivedNote" );
const listGoodsReceivedNote = mongoose.model('ListGoodsReceivedNote', listGoodsReceivedNoteSchema, "ListGoodsReceivedNote" );
const goodsReceivedNoteDetail = mongoose.model('GoodsReceivedNoteDetail', goodsReceivedNoteDetailSchema, "GoodsReceivedNoteDetail" );

module.exports = {
    goodsReceivedNoteModel: goodsReceivedNote,
    listGoodsReceivedNoteModel: listGoodsReceivedNote,
    goodsReceivedNoteDetailModel: goodsReceivedNoteDetail
}
