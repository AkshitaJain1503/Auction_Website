// all product carts section
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const {Product} = require("../../models/product");
const { User } = require("../../models/user");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async(req, res) => {
    const user_id = req.id;
    let user = await User.findOne({_id: user_id});
    const watchListProducts = user.watchList;
    var cartProducts = [];
    for(let i = 0; i < watchListProducts.length; i++) {
      var eachProduct = {};
      const auction = await Auction.findOne({_id: watchListProducts[i]});
      const auctionProduct = auction.product;
      const product = await Product.findOne({_id: auctionProduct});
      eachProduct.productName = product.productName;
      eachProduct.productDescription = product.productDescription;
      eachProduct.currentPrice = auction.productCurrentPrice;
      eachProduct.productImage = product.productImage;
      eachProduct.auction_id = auction._id;
      eachProduct.product_id = product._id;
      const formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.startDateTime);
      const formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.endDateTime);
      eachProduct.auctionStartDateTime = formattedStartTime;
      eachProduct.auctionEndDateTime = formattedEndTime;
      cartProducts.push(eachProduct);
    }
    res.status(200).send({data: cartProducts});
})

module.exports = router;