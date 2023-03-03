const { Auction } = require("../../models/auction");
var ObjectId = require('mongoose').Types.ObjectId;
const router = require("express").Router() ;

router.post("/", async (req, res) => {
    console.log("in auc space");
    console.log(req.body)
    // console.log(req.id)
    const bidderId = req.id 
    await Auction.findOneAndUpdate(
        { product: ObjectId("63fedf5ac5e32b83b6342f3a") }, 
        { $push: { bids: {
            bidder: ObjectId(bidderId),
            price: req.body.price
        } }}
    );
    res.json(req.body);
});

module.exports = router;
