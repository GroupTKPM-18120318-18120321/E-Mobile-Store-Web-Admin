const mongoose = require('mongoose');
const Schema = mongoose.Schema();
const mongoosePaginate = require('mongoose-paginate-v2');

//Tạo model
const orderSchema = mongoose.Schema({
    total: { type: Number, require: true },
    orderDate: { type: Date, default: Date.now() },
    deliveryDate: { type: Date, default: Date.now() },
    orderStatus: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'OrderStatus' },
    idCustomer: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Account' },
    phone: { type: String, require: true },
    //address: {type:String, require: true},
    street: { type: String },
    subDistrict: { type: String },
    district: { type: String },
    city: { type: String },
    paymentMethod: { type: String },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

//Format
const formatCurrency = (currency) => {
    let result = "";
    const arr = [];
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

orderSchema.virtual('ftotal').get(function () {
    return formatCurrency(this.total);
});



orderSchema.virtual('orderTime').get(function () {
    const time = new Date(this.orderDate);
    const d = time.getDate();
    const m = time.getMonth() + 1;
    const y = time.getFullYear();
    return d + "-" + m + "-" + y;
});

orderSchema.virtual('deliveryTime').get(function () {
    const time = new Date(this.orderDate);
    const d = time.getDate();
    const m = time.getMonth() + 1;
    const y = time.getFullYear();
    return d + "-" + m + "-" + y;
});

orderSchema.virtual('address').get(function () {
    return `${this.street}, ${this.subDistrict}, ${this.district}, ${this.city}`;
});
//

const orderStatusSchema = mongoose.Schema({
    //_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    statusName: { type: String }
});

const orderDetailSchema = mongoose.Schema({
    idProduct: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Product' },
    idOrder: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Order' },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
});

orderDetailSchema.virtual('ftotal').get(function () {
    return formatCurrency(this.total);
});

orderSchema.plugin(mongoosePaginate);
//orderStatusSchema.plugin(mongoosePaginate);
orderDetailSchema.plugin(mongoosePaginate);

const order = mongoose.model('Order', orderSchema, "Order");
const orderStatus = mongoose.model('OrderStatus', orderStatusSchema, "OrderStatus");
const orderDetail = mongoose.model('DetailOrder', orderDetailSchema, "DetailOrder");

module.exports = {
    orderModel: order,
    orderStatusModel: orderStatus,
    orderDetailModel: orderDetail
}
