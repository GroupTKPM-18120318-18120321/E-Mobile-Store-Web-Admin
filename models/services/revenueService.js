const mongoose = require('mongoose');
const moment = require('moment');

const goodsReceivedNoteModel = require('../mongoose/goodsReceivedNoteModel');
const productsService = require('../services/productsService');
const revenueModel = require('../mongoose/revenueModel');
const ordersModel = require('../mongoose/orderModel');
const ordersService = require('../services/ordersService');

//Neu la ngay 1 thi moi them
exports.addMonthRevenueReport = async (month, year) => {
	const report = {
		idRevenueReport: mongoose.Types.ObjectId('60c164f8fa36a8c8d5183e23'),
		date: String(month) + String(year),
		total: 0
	};

	const monthRevenue = new revenueModel.monthRevenueModel(report);
	await monthRevenue.save();
}

//month: String
//yaer: String

exports.updateMonthRevenueTotal = async (month, year) => {
	const nowDate = new Date();
	const startDate = new Date(year, month, 1);
	let endDate = new Date(Number(dateObj[1]), Number(dateObj[0]), 1);

	if (year === nowDate.getUTCFullYear()) {
		if (month === (nowDate.getUTCMonth() + 1)) {
			endDate = nowDate;
		}//Nhỏ hơn: đủ ngày. Lớn hơn : Khong hop le
	} //Nhỏ hơn: đủ ngày. Lớn hơn : Khong hop le

	const query = {
		date: {
			$gte: startDate,
			$lt: endDate
		}
	};

	const listDateRevenueReports = await revenueModel.dateRevenueDetailModel.find({ query });
	let dayRevenueTotal = 0;
	for (report of listDateRevenueReports) {
		dayRevenueTotal += report.dayTotalRevenue;
	}

	await revenueModel.monthRevenueModel.findByIdAndUpdate({ total: dayRevenueTotal });
}

exports.updateDateRevenueWithNewOrder = async (date, order) => {

}

exports.updateDateRevenueWithNewOrderGoodsReceivedNote = async (date, goodsReceivedNote) => {

}

exports.getListActiveMonths = async () => {
	const nowDate = new Date();
	const startDate = new Date('2021-01-01');

	let listActiveMonths = [];
	let i;

	for (i = startDate.getUTCFullYear(); i < nowDate.getUTCFullYear(); i++) {
		for (let j = 1; j <= 12; j++) {
			const dateStr = j + "/" + i;
			listActiveMonths.push(dateStr);
		}
	}

	for (let j = 1; j <= nowDate.getUTCMonth() + 1; j++) {
		const dateStr = j + "/" + i;
		listActiveMonths.push(dateStr);
	}

	return listActiveMonths;
}

// month, year: Number
// month: [1,12]
exports.calcMonthRevenue = async (month, year, listOrders) => {
	const startDate = new Date(year + "-" + month + "-1");
	const nowDate = new Date();
	let revenue = 0;
	let endDate;

	//Lay ngay cuoi cung cua thang "month"
	endDate = new Date(year, month, 1);

	if (year === nowDate.getUTCFullYear()) {
		if (month === (nowDate.getUTCMonth() + 1)) {
			endDate = nowDate;
		}//Nhỏ hơn: đủ ngày. Lớn hơn : Khong hop le
	} //Nhỏ hơn: đủ ngày. Lớn hơn : Khong hop le

	const startTime = startDate.getTime();
	const endTime = endDate.getTime();

	for (order of listOrders) {
		const date = order.orderDate.getTime();

		if (date >= startTime && date <= endTime) {
			revenue += order.total;
		}
	}

	return Number(revenue);
}

// month, year: Number
// month: [1,12]
exports.getListDateRevenue = async (month, year, listOrders) => {
	let result = [];
	//const startDate = new Date(year + "-" + month + "-1");
	let endDate;
	const nowDate = new Date();

	//Ngay cuoi cua thang xem doanh thu
	if (nowDate.getUTCFullYear() === year && nowDate.getUTCMonth() + 1 === month) {
		endDate = nowDate;
	} else {
		endDate = new Date(year, month, 0);
	}

	// Duyet cac ngay
	let listDatesOfMonths = [];

	for(let i = 1; i <= endDate.getDate(); i++){
		const date = new Date(year, month - 1, i);
		const tmp = await ordersService.countOrderInDate(date);
		listDatesOfMonths.push({ 
			date: date.getDate() + "/" + (date.getMonth() + 1), 
			count: tmp.count, 
			revenue: tmp.revenue
		});
	}

	console.log(listDatesOfMonths);
	return result;
}