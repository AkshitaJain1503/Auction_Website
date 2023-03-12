const router = require("express").Router();
const {Product} = require("../../models/product");
const { Auction } = require("../../models/auction");

router.get("/", async (req, res) => {

    //getting searched name from params
    const requestedProductName = req.query.name;
    var responseData = []; 
    
    // finding all the auction documents with matching param conditions [{},{},{}]
    let products = await Product.find({ productName :{ $regex : '.*'+ requestedProductName + '.*', $options: 'i' }});

    //getting the productIDs from the above document
    pIdList = []
    for(var i = 0; i<products.length; i++){
        pIdList.push(products[i]._id);
    }

    //getting those product documents corresponding to the pIdList
    let auction = await Auction.find({product: pIdList});
    
    //returning the info needed at front-end
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
    
        responseData.push(productDetails);
    }

    //returns the array of objects
    res.status(200).send({data:responseData}); 
});

module.exports = router;