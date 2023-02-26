// individual product details
const router = require("express").Router();
const {Product} = require("../../models/product");
const { User } = require("../../models/user");

router.get("/", async(req, res) => {
    console.log(req.query.name);
    const requested_name = req.query.name;

    const product = await Product.findOne({productName: requested_name});
    const sellerInfo = await User.findOne({_id: product.seller});
    console.log(sellerInfo);
    console.log(product);
    var productDetailsRequired = {};
    productDetailsRequired.productName = product.productName;
    productDetailsRequired.productDescription = product.productDescription;
    productDetailsRequired.productBasePrice = product.productBasePrice;
    productDetailsRequired.shipmentFrom = product.shipmentFrom;
    productDetailsRequired.productImage = product.productImage;
    productDetailsRequired.sellerFirstName = sellerInfo.firstName;
    productDetailsRequired.sellerLastName = sellerInfo.lastName;
    productDetailsRequired.sellerId = sellerInfo._id;
    console.log(productDetailsRequired);
    res.status(200).send({data: productDetailsRequired});
})

module.exports = router;