const router = require("express").Router();
const {User} = require("../../models/user");
const {Product} = require("../../models/product");
const { Auction } = require("../../models/auction");


//Get past products posted as data value of array of objects.
router.get("/", async (req, res) => {

    let requested_id;

//if the user wants his own past posts, then no id in params in the url.
    if(req.query.id == "null"){
        requested_id = req.id;  //id from middleware
    }
//if the past posts of the buyer or seller is demanded, then yes id in params in the url.
    else{
        requested_id = req.query.id;
    }

    var responseData = [];

    const user = await User.findOne({_id: requested_id});

    // array of product ids posted by the user
    let postedProducts = user.postedProducts;

    // to avoid hitting the DB query in a loop, writing a SQL equivalent IN query. 
    let products = await Product.find({_id: postedProducts});
    let auction = await Auction.find({product: postedProducts});

    //loop from last to display the latest posts on top
    for(var i=products.length-1 ; i >=0; i--){

        var productDetails = {};

        productDetails.SNo = products.length-i;
        productDetails.productId = products[i]._id;
        productDetails.productName = products[i].productName;
        productDetails.basePrice = products[i].productBasePrice;

        let formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction[i].startDateTime);
        let formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction[i].endDateTime);

        productDetails.startTime= formattedStartTime;
        productDetails.endTime= formattedEndTime;

        responseData.push(productDetails);
    }

//returns an array of json as the responseData
    res.status(200).send({data: responseData});
});

module.exports = router;
