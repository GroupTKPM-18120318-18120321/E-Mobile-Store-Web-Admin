const manufacturerService = require('../models/services/manufacturerService');
const productsService = require('../models/services/productsService');
const goodsReceivedNoteService = require('../models/services/goodsReceivedNoteService');

exports.displayAddProduct = async (req, res, next) => {
    // const product = await productsModel.find();
    // console.log(product);
    const manufacturer = await manufacturerService.getListManufacturer();
    res.render('products/addNewProduct', { manufacturer, pathAddProductForm: "/list-products/add-new-product", pathCancelButton: "/list-products" });
}

exports.displayAddProductToNhapHang = async (req, res, next) => {

    const manufacturer = await manufacturerService.getListManufacturer();
    res.render('products/addNewProduct', { manufacturer, pathAddProductForm: "/list-products/add-new-product-for-goods-received-note", pathCancelButton: "/list-products/create-goods-received-note" });
}

exports.addProductToDatabase = async (req, res, next) => {
    await productsService.addNewProduct(req, res, next);

    res.redirect("/list-products");
}

exports.addProductToDatabaseAndNhapHang = async (req, res, next) => {
    await productsService.addNewProduct(req, res, next);
    res.redirect("/list-products/create-goods-received-note");
}

exports.product = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        if (page < 0) page = 1;

        const limit = 6;
        const offset = (page - 1) * 6;
        const nameManufacturer = req.params.nameManufacturer;
        const nameProduct = req.query.nameProduct;

        const filter = {};
        if (nameProduct != undefined) {
            filter.name = new RegExp(nameProduct, "i");;
        }

        if (nameManufacturer != undefined) {
            const manufacturer = await manufacturerService.findOne({ manufacturer: nameManufacturer });
            if (manufacturer == null) {
                let err = new Error("Not found");
                err.status = 404;
                throw err;
            } else {
                filter.idmanufacturer = manufacturer._id;
            }
        }

        //Lấy dữ liệu
        const paginate = await productsService.listProduct(filter, limit, offset);

        const pageItem = []
        for (let i = 1; i <= paginate.totalPages; i++) {
            const items = {
                value: i,
                isActive: i === page
            }
            pageItem.push(items);
        }

        const manufacturers = await manufacturerService.getListManufacturer();

        res.render('products/listProducts',
            {
                product: paginate.docs,
                pageItem: pageItem,
                prevPage: paginate.prevPage,
                nextPage: paginate.nextPage,
                canGoPrev: paginate.hasPrevPage,
                canGoNext: paginate.hasNextPage,
                manufacturers
            });
    } catch (err) {
        next(err);
    }
};


exports.displayEdit = async (req, res, next) => {
    try {
        const id = req.params.id;
        //Lấy dữ liệu 
        const product = await productsService.findOne({ _id: id });
        const listManufacturer = await manufacturerService.getListManufacturerHaveSelected(product.idmanufacturer);
        res.render('products/editProduct', { product, isDisplay: product.detailImgs && product.detailImgs.length > 0, listManufacturer });
    } catch (err) {
        next(err);
    }
};

exports.edit = async (req, res, next) => {
    try {
        await productsService.editProduct(req, res, next);
        res.redirect("/list-products");
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id;

        //Lấy dữ liệu 
        const filter = { _id: id };
        await productsService.deleteProduct(filter);

        res.redirect("/list-products");
    } catch (err) {
        next(err);
    }
};

exports.viewProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        //Lấy dữ liệu 
        const product = await productsService.findOne({ _id: id });

        res.render('products/viewProduct', { product });
    } catch (err) {
        next(err);
    }
};

exports.displayGoodsReceivedNote = async (req, res, next) => {
    const products = await productsService.getListProductsAndManufacturer();
    res.render('products/goodsReceivedNote', { products, js_file: "../js/custom.js" });
}

exports.postGoodsReceivedNote = async (req, res, next) => {
    await goodsReceivedNoteService.addGoodsReceivedNoteToDB(req, res, next);
    res.redirect("/list-products");
}