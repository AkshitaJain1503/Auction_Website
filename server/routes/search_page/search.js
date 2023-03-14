const router = require("express").Router();
const mongoose = require("mongoose");
const {Product} = require("../../models/product");
const { Auction } = require("../../models/auction");
router.get("/", async (req, res) => {

    const requestedProductName = req.query.name;
    var responseData = []; //this is an array of objects
    
    let products = await Product.find({ productName :{ $regex : '.*'+ requestedProductName + '.*', $options: 'i' }});
    let auction = await Auction.find({ productName :{ $regex : '.*'+ requestedProductName + '.*', $options: 'i' }});
    //console.log(auction);
    for(var i=products.length-1 ; i >=0; i--){

        var productDetails = {}; // this will hold a single object

        productDetails.SNo = products.length-i;
        productDetails.productId = products[i]._id;
        productDetails.productName = products[i].productName;
        productDetails.basePrice = products[i].productBasePrice;
        productDetails.img = products[i].productImage;
        productDetails.shipment = products[i].shipmentFrom;

         let formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
         day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction[i].endDateTime);

        let formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction[i].startDateTime)

        productDetails.EndTime= formattedEndTime;
        productDetails.StartTime= formattedStartTime;
        productDetails.fEndTime= auction[i].endDateTime;
        productDetails.fStartTime= auction[i].startDateTime;
        //console.log(typeof(productDetails.fStartTime))
        responseData.push(productDetails);
    }
 res.status(200).send(responseData); //returns the array of objects
});
module.exports = router;
//