const router = require("express").Router();
const {User} = require("../../models/user");
const {Product} = require("../../models/product");


//Get past products posted as array value data.
router.get("/", async (req, res) => {
    var responseData = [];
    const user = await User.findOne({_id: req.id});

    // array of product ids posted by the user
    let postedProducts = user.postedProducts;

    // to avoid hitting the DB query in a loop, writing a SQL equivalent IN query. 
    let products = await Product.find({_id: postedProducts});

    //loop from last to display the latest posts on top
    for(var i=products.length-1 ; i >=0; i--){

        var productDetails = {};
        productDetails.SNo = products.length-i;
        productDetails.productId = products[i]._id;
        productDetails.productName = products[i].productName;
        productDetails.basePrice = products[i].productBasePrice;

        responseData.push(productDetails);
    }

//returns an array of json as the responseData
    res.status(200).send({data: responseData});
});

module.exports = router;
