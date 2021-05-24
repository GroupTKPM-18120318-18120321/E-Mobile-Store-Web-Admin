const ordersService = require('../models/services/ordersService');

exports.displayListOrders = async(req, res, next) => {
    const orders = await ordersService.getListOrders(req);
    const page=+req.query.page || 1;
    const limit =10;
    const offset =(page -1)*10;

    const numPage= Math.ceil((await ordersService.countListOrder())/limit);

    const pageItem=[]
    for(let i=1;i<=numPage;i++){
        const items={
            value:i,
            isActive:i===page
        }
        pageItem.push(items);
    }
    //console.log("order:" + orders);
    res.render('orders/listOrders', {
        orders,
        pageItem: pageItem,
        isPagination: numPage>=2, 
        prevPage: page>=2?page-1:1, 
        nextPage: page>=numPage?numPage:page+1,
        canGoPrev: page>=2,
        canGoNext: page<=numPage-1,
    });  
}

exports.viewOrderDetail = async(req, res, next) => {
    const orderDetail = await ordersService.getOrderDetail(req, res, next);
    const order = orderDetail.order;
    const details = orderDetail.details;

    const page=+req.query.page || 1;
    const limit =10;
    const offset =(page -1)*10;

    const numPage= Math.ceil((await ordersService.countDetailOrder({idOrder:req.params.id}))/limit);
    console.log((await ordersService.countDetailOrder({idOrder:req.params.id})));

    const pageItem=[]
    for(let i=1;i<=numPage;i++){
        const items={
            value:i,
            isActive:i===page
        }
        pageItem.push(items);
    }
    //console.log("order:" + orders);
    res.render('orders/orderDetail', {order, details,
        pageItem: pageItem,
        isPagination: numPage>=2, 
        prevPage: page>=2?page-1:1, 
        nextPage: page>=numPage?numPage:page+1,
        canGoPrev: page>=2,
        canGoNext: page<=numPage-1,
    });  
}