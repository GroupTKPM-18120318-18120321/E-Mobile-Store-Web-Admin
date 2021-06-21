const revenueService = require('../models/services/revenueService');
const ordersModel = require('../models/mongoose/orderModel');
const orderService = require('../models/services/ordersService');

// const formatConcurency = (concurency) => {
//     let result = "";
//     const arr = [];
//     let tmp;
//     do {
//         tmp = concurency % 1000;
//         if (tmp == 0) {
//             arr.unshift("000");
//         } else if (tmp < 10) {
//             arr.unshift("00" + tmp);
//         } else if (tmp < 100) {
//             arr.unshift("0" + tmp);
//         } else {
//             arr.unshift(tmp);
//         }
//         //arr.unshift(tmp==0?"000":tmp);
//         concurency = Math.floor(concurency / 1000);
//     } while (concurency >= 1000);

//     arr.unshift(concurency);

//     for (let i = 0; i < arr.length; i++) {
//         result += arr[i];
//         result += i == arr.length - 1 ? "" : ".";
//     }

//     return result;
// }

exports.displayMonthRevenue = async(req, res, next) => {
    if(req.user){
        // let filter = req.query.filter;
        // let data = [];

        // console.log(req.query.filter);

        // let monthRevenue;
        // let month;//thang truy van
        // let year;//nam truy van
        // const list = await revenueService.getListActiveMonths();

        // if (filter == undefined) {
        //     filter = list[list.length - 1];// Chọn tháng hiện tại để hiển thị doanh thu
        // }

        // //console.log(filter);

        // const dateObj = String(filter).split("/");
        // month = Number(dateObj[0]);// month: [1,12]
        // year = Number(dateObj[1]);
        // const listOrders = await ordersModel.orderModel.find();
        // monthRevenue = await revenueService.calcMonthRevenue(month, year, listOrders);
        // const listDateRevenue = await revenueService.getListDateRevenue(month, year);
        // console.log(listDateRevenue);
        // const now = new Date();
        // let todayRevenue;
        // if (month === now.getUTCMonth()){
        //     todayRevenue = orderService.countOrderInDate(now);
        // }

        // const yearSales = await orderService.caculateRevenue("year", now.getFullYear());
        // const monthSales = await orderService.caculateRevenue("month", now.getMonth());
        // const daySales = await orderService.caculateRevenue("day", now.getDate());
        // const quarterSales = await orderService.caculateRevenue("quarter", Math.floor(now.getMonth() / 3));


        // const datamongoose = {};

        // if (filter === "year") {
        //     //Tính doanh số trong 5 năm trở lại đây
        //     for (let i = 0; i < 5; i++) {
        //         datamongoose[now.getFullYear() - i] = await orderService.caculateRevenue("year", now.getFullYear() - i);
        //     }
        // }
        // else if (filter === "month") {
        //     //Tính doanh số của 12 tháng trong năm
        //     for (let i = 0; i < 12; i++) {
        //         datamongoose[i + 1] = await orderService.caculateRevenue("month", i)
        //     }
        // }
        // else if (filter === "quarter") {
        //     //Tính doanh số của 4 quý trong năm
        //     for (let i = 0; i < 4; i++) {
        //         datamongoose[i + 1] = await orderService.caculateRevenue("quarter", i)
        //     }
        // }
        // else {
        //     for (let i = 0; i < 12; i++) {
        //         datamongoose[i + 1] = await orderService.caculateRevenue("month", i)
        //     }
        // }

        // let listData = Object.entries(datamongoose);
        // let listObjectData = [];
        // for (let i = 0; i < listData.length; i++) {
        //     var key = (listData[i][0]).toString();
        //     var obj = {};
        //     obj[key] = listData[i][1];
        //     listObjectData.push(obj);
        // }

        // let database = listObjectData;

        // for (let i = 0; i < database.length; i++) {
        //     let element = Object.entries(database[i])[0];
        //     data.push({ index: i, label: element[0], num: element[1] });
        // }
        //console.log("data");

        const result = await revenueService.displayChartAndMonthRevenue(req);
        res.render('index', result);
    } else {
        res.redirect('/login');
    }
}