// cart section
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const {Product} = require("../../models/product");
const { User } = require("../../models/user");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async(req, res) => {
    const product_id = req.query.id;
    const user_id = req.id;
    const auction = await Auction.findOne({product: product_id});
    
    let user = await User.findOne({_id: user_id});
    const watchListProducts = user.watchList;
    let isPresent = false;
    
    for(let i = 0; i < watchListProducts.length; i++) {
      if(`${watchListProducts[i]}` == `${auction._id}`) {
        isPresent = true;
      }
    } 
    if(!isPresent) {
      await User.findOneAndUpdate(
        { _id: user_id }, 
        { 
          $push: {watchList: auction._id}
        })
      await Auction.findOneAndUpdate(
        {_id: auction._id},
        {
          $push: {subscribers: user_id}
        })  
    }
    res.status(200).send(`Product is added to watchlist!`);
})

module.exports = router;