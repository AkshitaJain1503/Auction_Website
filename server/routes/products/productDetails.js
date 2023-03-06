// individual product details
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const {Product} = require("../../models/product");
const { User } = require("../../models/user");

router.get("/", async(req, res) => {
    // console.log(req.query.id);
    const requested_id = req.query.id;

    const product = await Product.findOne({_id: requested_id});
    const auction = await Auction.findOne({product: requested_id});
    const sellerInfo = await User.findOne({_id: product.seller});
    // console.log(sellerInfo);
    // console.log(auction);
    var productDetailsRequired = {};
    productDetailsRequired.productName = product.productName;
    productDetailsRequired.productDescription = product.productDescription;
    productDetailsRequired.productBasePrice = product.productBasePrice;
    productDetailsRequired.shipmentFrom = product.shipmentFrom;
    productDetailsRequired.productImage = product.productImage;
    productDetailsRequired.sellerName = sellerInfo.name;
    const formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.startDateTime);
    const formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.endDateTime);
    productDetailsRequired.aucStart= formattedStartTime;
    productDetailsRequired.aucEnd= formattedEndTime;
    // productDetailsRequired.sellerLastName = sellerInfo.lastName;
    productDetailsRequired.sellerId = sellerInfo._id;
    // console.log(productDetailsRequired.aucEnd);
    res.status(200).send({data: productDetailsRequired});
})

module.exports = router;