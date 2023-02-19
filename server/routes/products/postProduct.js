// post product details
const router = require("express").Router();
const {Product} = require("../../models/product");
const {User} = require("../../models/user");
var ObjectId = require('mongoose').Types.ObjectId;

router.post("/", async (req, res) => {

    console.log("data fetched");
    const sellerId = req.id 
    
//Adding product details and sellerID in the product model.
    const product = await new Product({ ... req.body, seller: sellerId}).save();

//adding ProductID against the specific seller in the user model. 
    await User.findOneAndUpdate(
        { _id: ObjectId(sellerId) }, 
        { $push: { postedProducts: ObjectId(product._id) }}
    );

    res.json(req.body);
});
module.exports = router;
