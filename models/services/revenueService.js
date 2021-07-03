const mongoose = require('mongoose');
const moment = require('moment');

const goodsReceivedNoteService = require ('./goodsReceivedNoteService');
const revenueModel = require('../mongoose/revenueModel');
const ordersModel = require('../mongoose/orderModel');
const orderService = require('./ordersService');

const formatCurrency = (currency) => {
	let result = "";
	const arr = [];
	let tmp;
	if (currency < 1000 && currency >= 0) {
		result = String(currency);
	} else {
		let isNegativeNumber = false;
		if (currency < 0){
			isNegativeNumber = true;
		}

		currency = Math.abs(currency);

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
			//arr.unshift(tmp==0?"000":tmp);
			currency = Math.floor(currency / 1000);
		} while (currency >= 1000);

		arr.unshift(currency);

		if (isNegativeNumber){
			result += '-';
		}

		for (let i = 0; i < arr.length; i++) {
			result += arr[i];
			result += i == arr.length - 1 ? "" : ".";
		}
	}

	return result;
}

//Neu la ngay 1 thi moi them
exports.addMonthRevenueReport = async (month, year) => {
	const report = {
		idRevenueReport: mongoose.Types.ObjectId('60c164f8fa36a8c8d5183e23'),
		date: String(month) + "/" + String(year),
		total: 0
	};

	const monthRevenue = new revenueModel.monthRevenueModel(report);
	await monthRevenue.save();
}

//month: String
//year: String
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

exports.updateDateRevenueWithGoodsReceivedNote = async (date, totalPrice) => {
	const startDate = new Date(date.getFullYear() + "-" + String(date.getMonth() + 1) + "-" + date.getDate());
	const endDate = new Date(date.getFullYear() + "-" + String(date.getMonth() + 1) + "-" + String(date.getDate() + 1));
	const query = {
		date: {
			$gte: startDate,
			$lt: endDate
		}
	};

	const dateRevenue = await revenueModel.dateRevenueDetail.findOne(query);
	await revenueModel.dateRevenueDetail.findOneAndUpdate({ _id: dateRevenue._id }, {
		totalCost: dateRevenue.totalCost + totalPrice
	});

	console.log("Cap nhat doanh thu ngay voi phieu nhap hang thanh cong");
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

//Tạo báo cáo doanh thu ngày
// month, year: Number
// month: [1,12]
exports.createListDayRevenue = async (month, year, monthRevenueReportID) => {
	const endDate = new Date(year, month, 0);
	const end = endDate.getDate();
	let date;

	for (let i = 1; i <= end; i++) {
		date = new Date(year, month - 1, i);
		const data = {
			idMonthRevenue: monthRevenueReportID,
			date: date
		}
		const revenue = await revenueModel.dateRevenueDetail(data);
		await revenue.save();
	}
	console.log("Them ngay thanh cong");
}

// month, year: Number
// month: [1,12]
exports.getListDateRevenue = async (month, year) => {
	let endDate;
	const nowDate = new Date();

	//Ngay cuoi cua thang xem doanh thu
	if (nowDate.getUTCFullYear() === year && nowDate.getUTCMonth() + 1 === month) {
		endDate = nowDate;
	} else {
		endDate = new Date(year, month, 0);
	}

	const query = month + "/" + year;
	let monthRevenue = await revenueModel.monthRevenueModel.findOne({ date: query });

	//Khi chưa có đơn hàng nào trong tháng => null
	if (monthRevenue == null) {
		await this.addMonthRevenueReport(month, year);
		monthRevenue = await revenueModel.monthRevenueModel.findOne({ date: query });
		await this.createListDayRevenue(month, year, monthRevenue._id);
	}

	const data = await revenueModel.dateRevenueDetail.find({ idMonthRevenue: monthRevenue._id });

	//Tìm tháng/năm. Lấy ngày làm index.
	//const listGoodsReceivedNoteInMonth = await goodsReceivedNoteService.getGoodsReceivedNoteInMonth(month, year);

	// Duyet cac ngay
	let listDatesOfMonths = [];
	const end = endDate.getDate();
	for (let i = 1; i <= end; i++) {
		//const date = new Date(year, month - 1, i);
		//const tmp = await ordersService.countOrderInDate(date);
		const formatDate = data[i - 1].date.getDate() + "/" + (data[i - 1].date.getMonth() + 1) + "/" + data[i - 1].date.getFullYear();
		listDatesOfMonths.push({
			index: i,
			date: formatDate,
			numberOfOrders: data[i - 1].numberOfOrders,
			dayTotalRevenue: data[i - 1].dayTotalRevenue,
			//totalPrice: listGoodsReceivedNoteInMonth[i - 1].totalPrice,
			//total: data[i - 1].dayTotalRevenue - listGoodsReceivedNoteInMonth[i - 1].totalPrice
			totalCost: data[i - 1].totalCost,
			total: data[i - 1].dayTotalRevenue - data[i - 1].totalCost
		});
	}

	//console.log(listDatesOfMonths);
	return listDatesOfMonths;
}

exports.displayChartAndMonthRevenue = async (req) => {
	let filter = req.query.filter;
	let data = [];
	//let monthRevenue;
	let month;//thang truy van
	let year;//nam truy van
	const list = await this.getListActiveMonths();

	if (filter == undefined) {
		filter = list[list.length - 1];// Chọn tháng hiện tại để hiển thị doanh thu
	}

	const dateObj = String(filter).split("/");
	month = Number(dateObj[0]);// month: [1,12]
	year = Number(dateObj[1]);
	let listDateRevenue = await this.getListDateRevenue(month, year);

	const now = new Date();

	const yearSales = await orderService.caculateRevenue("year", now.getFullYear());
	const monthSales = await orderService.caculateRevenue("month", now.getMonth());
	const daySales = await orderService.caculateRevenue("day", now.getDate());
	const quarterSales = await orderService.caculateRevenue("quarter", Math.floor(now.getMonth() / 3));

	//Doanh thu thang = Tong thu tu don hang - Tong chi nhap hang
	// let monthSales = 0;
	for (let i = 0; i < listDateRevenue.length; i++) {
		data.push({ index: i, label: listDateRevenue[i].index, num: listDateRevenue[i].total });
		// += listDateRevenue[i].total;
	}

	//Định dạng lại cách hiển thị số tiền
	for (let i = 0; i < listDateRevenue.length; i++) {
		listDateRevenue[i].dayTotalRevenue = formatCurrency(listDateRevenue[i].dayTotalRevenue);
		listDateRevenue[i].totalCost = formatCurrency(listDateRevenue[i].totalCost);
		listDateRevenue[i].total = formatCurrency(listDateRevenue[i].total);
	}

	const result = {
		data,
		numData: data.length,
		daySales: formatCurrency(daySales),
		monthSales: formatCurrency(monthSales),
		quarterSales: formatCurrency(quarterSales),
		yearSales: formatCurrency(yearSales),
		listActiveMonths: list,
		//revenue: monthRevenue,
		chartTitle: filter,
		dateRevenue: listDateRevenue
	}

	return result;
}