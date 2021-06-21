const mongoose= require('mongoose');
const Schema = mongoose.Schema();

const monthRevenueSchema = mongoose.Schema({
    idRevenueReport: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'RevenueReport'},
    date: {type: String, require: true},// Thang/Nam
    total: {type: Number, require: true, default: 0}//Tong doanh thu trong thang
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

const revenueReportSchema = mongoose.Schema({

});

const dateRevenueDetailSchema = mongoose.Schema({
    idMonthRevenue: {type: mongoose.Schema.Types.ObjectId , require: true, ref: 'MonthRevenue'},
    date: {type: Date, require: true},//Ngày trong tháng dùng để tìm các phiếu nhập hàng và các đơn hàng cùng ngày
    numberOfOrders: {type: Number, required: true, default: 0},//Tong so don hang duoc dat trong ngay
    dayTotalRevenue: {type: Number, required: true, default: 0},//So tiên thu duoc tu cac don hang
    totalCost: {type: Number, required: true, default: 0},//So tien chi cho hoa don nhap hang trong ngay
});

//Format
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

monthRevenueSchema.virtual('ftotalMonthRevenue').get(function() {
    return formatCurrency(this.total); 
});

dateRevenueDetailSchema.virtual('ftotalCost').get(function() {
    return formatCurrency(this.totalCost); 
});

dateRevenueDetailSchema.virtual('fdayTotalRevenue').get(function() {
    return formatCurrency(this.dayTotalRevenue); 
});

monthRevenueSchema.virtual('fdateOfMonth').get(function() {
    const time= new Date(this.orderDate);
    const d = time.getDate();
    const m =  time.getMonth() +1;
    const y =  time.getFullYear(); 
    return d + "-" + m + "-" + y;
});

const revenueReport = mongoose.model('RevenueReport', revenueReportSchema, "RevenueReport" );
const monthRevenue = mongoose.model('MonthRevenue', monthRevenueSchema, "MonthRevenue" );
const dateRevenueDetail = mongoose.model('DateRevenueDetail', dateRevenueDetailSchema, "DateRevenueDetail" );

module.exports = {
    revenueReportModel: revenueReport,
    monthRevenueModel: monthRevenue,
    dateRevenueDetail: dateRevenueDetail
}
