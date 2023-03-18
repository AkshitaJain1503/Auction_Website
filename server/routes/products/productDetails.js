// individual product details
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const {Product} = require("../../models/product");
const { User } = require("../../models/user");

router.get("/", async(req, res) => {
    // obtaining or fetching individual product details for product page

    // obtaining the requested product id from server side URL query
    const requested_id = req.query.id;

    // obtaining product document from product id
    const product = await Product.findOne({_id: requested_id});

    // obtaining auction document from product id
    const auction = await Auction.findOne({product: requested_id});

    // obtaining user document from product's seller id
    const sellerInfo = await User.findOne({_id: product.seller});

    // storing necessary information in an object
    var productDetailsRequired = {};
    productDetailsRequired.productName = product.productName;
    productDetailsRequired.productDescription = product.productDescription;
    productDetailsRequired.productBasePrice = product.productBasePrice;
    productDetailsRequired.shipmentFromPlace = product.shipmentFromPlace;
    productDetailsRequired.productImage = product.productImage;
    productDetailsRequired.sellerName = sellerInfo.name;
    const formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.startDateTime);
    const formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.endDateTime);
    productDetailsRequired.aucStart= formattedStartTime;
    productDetailsRequired.aucEnd= formattedEndTime;
    productDetailsRequired.sellerId = sellerInfo._id;

    // sending response to the client side about all the product details fetched
    res.status(200).send({data: productDetailsRequired});
})

module.exports = router;