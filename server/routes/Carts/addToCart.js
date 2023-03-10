// cart section
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const {Product} = require("../../models/product");
const { User } = require("../../models/user");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async(req, res) => {
    const product_id = req.query.id;
    const user_id = req.id;
    console.log(product_id);
    console.log(user_id);
    const auction_id = await Auction.findOne({product: product_id});
    // console.log(auction_id._id);
    
    let Products = await User.findOne({_id: user_id});
    const watchListProducts = Products.watchList;
    let isPresent = false;
    var cartProducts = [];
    for(let i = 0; i < watchListProducts.length; i++) {
      if(`${watchListProducts[i]}` == `${auction_id._id}`) {
        // console.log(`new ObjectId("${auction_id._id}")`);
        console.log(watchListProducts[i]);
        isPresent = true;
      }
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
      cartProducts.push(eachProduct);
    } 
    console.log(isPresent);
    if(isPresent == false) {
      await User.findOneAndUpdate(
        { _id: user_id }, 
        { 
          $push: {watchList: auction_id}
        })
      await Auction.findOneAndUpdate(
        {_id: auction_id},
        {
          $push: {subscribers: user_id}
        })  
    }
    // console.log(cartProducts);
    res.status(200).send({data: cartProducts});
})

module.exports = router;