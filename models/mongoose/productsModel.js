const mongoose= require('mongoose');
const Schema = mongoose.Schema();
const mongoosePaginate = require('mongoose-paginate-v2');

//Tạo model
const productSchema = mongoose.Schema({
    name: {type: String, require: true},
    baseprice: {type: String, require: true},
    discountprice: {type: String, require: true},
    cover: {type: String, require: true},
    idmanufacturer: {type: mongoose.Schema.Types.ObjectId, require: true},
    battery: {type: String, require: true},
    camera: {type: String, require: true},
    processor: {type: String, require: true},
    screen:{type: String, require: true},
    storage: {type: String, require: true},
    quantityAvailable: {type: Number, min: 1, required: true},
    description: {type: String, required: true},
    releaseDay: {type: Date, default: Date.now()},
    DeletedState: {type: Number, default: 0, enum: [0,1]},
    detailImgs: {type: [String], require: true},
    reviewNum: {type: Number, default: 0, require: true},
    trackNum: {type: Number, default: 0, require: true},
    quantitySold: {type: Number, default: 0, require: true}
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})


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

const getConcurency = (strConcurency) =>{
    let result=0;
    const arr=strConcurency.split(".");
    for(let i of arr){
        result = result*1000+parseInt(i);
    }  

    return result;
}

productSchema.virtual('fbaseprice').get(function() {
    return formatConcurency(this.baseprice); 
});

productSchema.virtual('fdiscountprice').get(function() {
    return formatConcurency(this.discountprice); 
});

productSchema.virtual('discount').get(function() {
    return this.baseprice-this.discountprice; 
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema, "allmobiles" )
