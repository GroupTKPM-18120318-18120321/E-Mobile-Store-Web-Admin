const mongoose= require('mongoose');

const ordersModel = require('../mongoose/orderModel');

exports.getListOrders = async(req) => {

	const page=+req.query.page || 1;
    const limit =10;
    const offset =(page -1)*10;
    const orders = await ordersModel.orderModel.find({})
 	.populate({ path: "orderStatus" }).skip(offset).limit(limit)
 	.exec().then(async (docs) => {
   		const options = {
			path: "idCustomer",
			model: "Account",
   		}

		const result = await ordersModel.orderModel.populate(docs, options);
		//console.log(result.idCustomer.name);

   		return result;
	});
	  
	return orders;
}

exports.countListOrder = async ()=>{
	return await ordersModel.orderModel.countDocuments();
}

exports.getOrderDetail = async (req, res, next) => {
	const id = req.params.id;
	const page=+req.query.page || 1;
    const limit =10;
    const offset =(page -1)*10;

	const order = await ordersModel.orderModel.findOne({_id: id})
	.populate({ path: "orderStatus" })
	.exec().then(async (docs) => {
		  const options = {
		   path: "idCustomer",
		   model: "Account",
		}

	   	const result = await ordersModel.orderModel.populate(docs, options);
	   	//console.log("customer: " + result);
		return result;
	});
	   
	const details = await ordersModel.orderDetailModel.find({idOrder: id})
	.populate({ path: "idOrder" }).skip(offset).limit(limit)
	//.populate({path: "idProduct" })
	.exec().then(async (docs) => {
		const options = {
		 	path: "idProduct",
		 	model: "Product",
		}

		const result = await ordersModel.orderDetailModel.populate(docs, options);
		//console.log("detail: " + result);
	  	return result;
	});

	let orderDetail = {order, details};

	//console.log(orderDetail);
	return orderDetail;
}

exports.countDetailOrder = async (query)=>{
	//const id = req.params.id;
	return await ordersModel.orderDetailModel.countDocuments(query);
}

exports.caculateRevenue= async(filter,time)=>{
	const listOrder = await ordersModel.orderModel.find();
	let revenue=0;
	let now = new Date();
	
	for(let i of listOrder){
		if(filter == "year" && i.orderDate.getFullYear()==time){
			revenue+=i.total;
		}
		else if(i.orderDate.getFullYear()==now.getFullYear()){
			if(filter=="month" && i.orderDate.getMonth()==time)
				revenue+=i.total;
			else if(filter=="quarter" && Math.floor(i.orderDate.getMonth()/3)==time)
				revenue+=i.total;
			else if(i.orderDate.getMonth()==now.getMonth()){
				if(filter=="day" && i.orderDate.getDate()==now.getDate()){
					revenue+=i.total;
				}
			}
			
		}
	}

	return revenue;
}

const topProduct = async(filter,time) =>{
	const listOrder = await ordersModel.orderModel.find();
	const order=[];
	let now = new Date();
	for(let i of listOrder){
		if(filter == "year" && i.orderDate.getFullYear()==time){
			order.push(i);
		}
		else if(i.orderDate.getFullYear()==now.getFullYear()){
			if(filter=="month" && i.orderDate.getMonth()==time)
				order.push(i);
			else if(filter=="quarter" && Math.floor(i.orderDate.getMonth()/3)==time)
				order.push(i);
			else if(i.orderDate.getMonth()==now.getMonth()){
				if(filter=="day" && i.orderDate.getDate()==now.getDate()){
					order.push(i);
				}
			}
			
		}
	}

	
}