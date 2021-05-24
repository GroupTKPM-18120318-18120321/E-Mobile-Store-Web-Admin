const express = require('express');
const router = express.Router();
const passport = require('../passport/passport');

const adminAccountController = require('../controllers/adminAccountController');
const orderService = require('../models/services/ordersService');


const formatConcurency = (concurency) => {
    let result = "";
    const arr = [];
    let tmp;
    do {
        tmp = concurency % 1000;
        arr.unshift(tmp == 0 ? "000" : tmp);
        concurency = Math.floor(concurency / 1000);
    } while (concurency > 0);

    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
        result += i == arr.length - 1 ? "" : ".";
    }

    return result;
}
/* GET home page. */
router.get('/', async (req, res, next) => {
    if (req.user) {
        //let data = [0, 100, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000];
        // const daySales = 100;
        const weekSales = 100;
        // const monthSales = 100;
        // const quarterSales = 100;
        // const yearSales = 100;

        let data = [];
        // let months=[{"Jan": 100}, {"Feb": 100}
        // , {"Mar":100}, {"Apr":100}, {"May":100}, {"Jun":100}, {"Jul":100}];
        // //, {"Aug":100}, {"Sep":100}, {"Oct":100}, {"Nov":100},{"Dec":100}];
        console.log(req.query.filter);
        const filter = req.query.filter;
        const now = new Date();

        const yearSales = await orderService.caculateRevenue("year", now.getFullYear());
        const monthSales = await orderService.caculateRevenue("month", now.getMonth());
        const daySales = await orderService.caculateRevenue("day", now.getDate());
        const quarterSales = await orderService.caculateRevenue("quarter", Math.floor(now.getMonth() / 3));


        const datamongoose = {};

        if (filter === "year") {
            //Tính doanh số trong 5 năm trở lại đây
            for (let i = 0; i < 5; i++) {
                datamongoose[now.getFullYear() - i] = await orderService.caculateRevenue("year", now.getFullYear() - i);
            }
        }
        else if (filter === "month") {
            //Tính doanh số của 12 tháng trong năm
            for (let i = 0; i < 12; i++) {
                datamongoose[i + 1] = await orderService.caculateRevenue("month", i)
            }
        }
        else if (filter === "quarter") {
            //Tính doanh số của 4 quý trong năm
            for (let i = 0; i < 4; i++) {
                datamongoose[i + 1] = await orderService.caculateRevenue("quarter", i)
            }
        }
        else{
            for (let i = 0; i < 12; i++) {
                datamongoose[i + 1] = await orderService.caculateRevenue("month", i)
            }
        }

        console.log("aaaaa");
        console.log(datamongoose)
        let listData = Object.entries(datamongoose);
        let listObjectData = [];
        for (let i = 0; i < listData.length; i++) {
            var key = (listData[i][0]).toString();
            var obj = {};
            obj[key] = listData[i][1];
            listObjectData.push(obj);
        }
        console.log(listObjectData);

        let database = listObjectData;
        // let months=[{"ngay1": 100}, {"ngay2": 100}
        // , {"ngay3":100}, {"ngay4":100}, {"ngay5":100}, {"ngay6":100}, {"ngay7":100}];
        //, {"Aug":100}, {"Sep":100}, {"Oct":100}, {"Nov":100},{"Dec":100}];

        // console.log("element")
        // console.log(Object.entries(element[2])[0][0]);
        for (let i = 0; i < database.length; i++) {
            let element = Object.entries(database[i])[0];
            data.push({ index: i, label: element[0], num: element[1] });
        }
        console.log("data");

        console.log(data);
        res.render('index', {
            data,
            numData: data.length,
            daySales: formatConcurency(daySales),
            //weekSales: formatConcurency(weekSales),
            monthSales: formatConcurency(monthSales),
            quarterSales: formatConcurency(quarterSales),
            yearSales: formatConcurency(yearSales)
        });
    } else res.redirect('/login');
});

// router.get('/', (req, res, next) => {
//                     res.render('index');
// });

router.get('/login', adminAccountController.displayLogin);

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
