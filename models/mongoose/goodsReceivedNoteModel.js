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

//Format
const formatConcurency = (concurency)=>{
    let result="";
    const arr=[];
    let tmp;
    do{
        tmp=concurency%1000;
        arr.unshift(tmp==0?"000":tmp);
        concurency=Math.floor(concurency/1000);
    }while(concurency>0);

    for(let i=0;i<arr.length;i++){
        result+=arr[i];
        result += i==arr.length-1 ? "" :".";
    }   

    return result;
}

// orderSchema.virtual('ftotal').get(function() {
//     return formatConcurency(this.total); 
// });

// orderSchema.virtual('orderTime').get(function() {
//     const time= new Date(this.orderDate);
//     const d = time.getDate();
//     const m =  time.getMonth() +1;
//     const y =  time.getFullYear(); 
//     return d + "-" + m + "-" + y;
// });

// orderSchema.virtual('deliveryTime').get(function() {
//     const time= new Date(this.orderDate);
//     const d = time.getDate();
//     const m =  time.getMonth() +1;
//     const y =  time.getFullYear(); 
//     return d + "-" + m + "-" + y;
// });

// orderSchema.virtual('address').get(function() {
//         return `${this.street}, ${this.subDistrict}, ${this.district}, ${this.city}`; 
// });
// //

const listGoodsReceivedNoteSchema = mongoose.Schema({

});

const goodsReceivedNoteDetailSchema = mongoose.Schema({
    idGoodsReceivedNote: {type: mongoose.Schema.Types.ObjectId , require: true, ref: 'GoodsReceivedNote'},
    idProduct: {type: mongoose.Schema.Types.ObjectId , require: true, ref: 'Product'},
    quantity: {type: Number, required: true},
    productPrice: {type: Number, required: true},//Gia nhap cua san pham
    totalPriceOneProduct: {type: Number, required: true},
});

// orderDetailSchema.virtual('ftotal').get(function() {
//     return formatConcurency(this.total); 
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
