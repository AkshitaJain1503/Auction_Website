//Past purchases info won by buyer or seller or user (me) him/herself: GET
const router = require("express").Router();
const {User} = require("../../models/user");
const {Product} = require("../../models/product");
const { Auction } = require("../../models/auction");

//Get past products purchased (won) as array of objects. [{},{},{}...]
router.get("/", async (req, res) => {

    let requested_id;

    //if the user wants his own past purchases, then no id in params in the url.
    if(req.query.id == "null"){
        requested_id = req.id;  //id from middleware
    }
    //if the past purchases of the buyer or seller is demanded, then yes id in params in the url.
    else{
        requested_id = req.query.id;
    }

    var responseData = [];

    //finiding user corresponding to the user ID
    const user = await User.findOne({_id: requested_id});

    // array of product ids purchased by the user
    let purchasedProducts = user.purchasedProducts;

    // to avoid hitting the DB query in a loop, writing a SQL equivalent IN query. 
    //product and auction documents corresponding to all purchased productIDs
    let products = await Product.find({_id: purchasedProducts});
    let auctions = await Auction.find({product: purchasedProducts});

    //loop from last to display the latest posts on top
    //details to be sent at the front-end.
    for(var i=products.length-1 ; i >=0; i--){

        var productDetails = {};

        productDetails.SNo = products.length-i;
        productDetails.productId = products[i]._id;
        productDetails.productName = products[i].productName;
        productDetails.basePrice = products[i].productBasePrice;
        productDetails.soldAt = auctions[i].bids[0].price;

        let formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auctions[i].endDateTime);

        productDetails.wonOn= formattedEndTime;
        
        responseData.push(productDetails);
    }

    //returns an array of objects as the responseData {data: [{},{},{}..]}
    res.status(200).send({data: responseData});
});

module.exports = router;



