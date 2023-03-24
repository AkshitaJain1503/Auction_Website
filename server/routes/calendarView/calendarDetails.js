//Getting calendar details of a specific date and product searched : GET
const router = require("express").Router();
const {Product} = require("../../models/product");
const {Auction} = require("../../models/auction");

//Get all the auction and product details with searched name and date.
router.get("/", async (req, res) => {

    const requestedProductName = req.query.name;
    const dateOnly =  req.query.date;

    // finding all the auction documents with matching param conditions [{},{},{}]
    let auctList = await Auction.find( 
        { productName: { $regex : '.*'+ requestedProductName + '.*', $options: 'i' }, 
        startDate: dateOnly});

    // array of product Ids to get data from product collection. [,,,]
    let pIdList = [];
    for(var i = 0; i < auctList.length; i++){
        let pId = auctList[i].product;
        pIdList.push(pId);
    }

    //finding all the product documents with all productIds in pIdList [{},{},{}]
    let productList = await Product.find({_id: pIdList});

    //make a relation {pId:{shipment:,base:,img:..}{},{}} to avoid hitting db again and again later.
    let relation = {};
    for(var i = 0; i< productList.length; i++){
        let productDetails = {};
        let productId  = productList[i]._id;
        productDetails.shipment = productList[i].shipmentFromPlace;
        productDetails.basePrice = productList[i].productBasePrice;
        productDetails.productName = productList[i].productName;
        productDetails.img = productList[i].productImage;
        relation[productId] = productDetails;
    }

    //final retrival of all details from both product and auction collection needed for the front-end [{},{},{}]
    let responseArray = [];
    for(var i = 0; i<auctList.length; i++){
        let resdata = {};

        let formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auctList[i].startDateTime);
        let formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auctList[i].endDateTime);

        resdata.StartTime = formattedStartTime;
        resdata.EndTime= formattedEndTime;

        let productId = auctList[i].product;
        resdata.productId = productId;

        resdata.img = relation[productId].img;
        resdata.productName = relation[productId].productName;
        resdata.basePrice = relation[productId].basePrice;
        resdata.shipment = relation[productId].shipment;

        responseArray.push(resdata);
    }

    //returns an array of objects. {data: [{},{},{}...]}
    res.status(200).send({data: responseArray});
});


module.exports = router;

