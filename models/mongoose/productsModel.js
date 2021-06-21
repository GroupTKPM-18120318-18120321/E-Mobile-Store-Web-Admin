const mongoose= require('mongoose');
const Schema = mongoose.Schema();
const mongoosePaginate = require('mongoose-paginate-v2');

//Tạo model
const productSchema = mongoose.Schema({
    name: {type: String, require: true},
    baseprice: {type: String, require: true},
    discountprice: {type: String, require: true},
    cover: {type: String, require: true},
    idmanufacturer: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Manufacturer'},
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


const formatCurrency = (currency)=>{
    let result="";
    const arr=[];
    let tmp;
    if (currency < 1000) {
        result = String(currency);
    } else {
		do {
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
            
			currency = Math.floor(currency / 1000);
		} while (currency >= 1000);
	
		arr.unshift(currency);
	
		for (let i = 0; i < arr.length; i++) {
			result += arr[i];
			result += i == arr.length - 1 ? "" : ".";
		}
	}   

    return result;
}

const getCurrency = (strCurrency) =>{
    let result=0;
    const arr=strCurrency.split(".");
    for(let i of arr){
        result = result*1000+parseInt(i);
    }  

    return result;
}

productSchema.virtual('fbaseprice').get(function() {
    return formatCurrency(this.baseprice); 
});

productSchema.virtual('fdiscountprice').get(function() {
    return formatCurrency(this.discountprice); 
});

productSchema.virtual('discount').get(function() {
    return this.baseprice-this.discountprice; 
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema, "allmobiles" )
