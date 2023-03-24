const router = require("express").Router();
const {Product} = require("../../models/product");
const { Auction } = require("../../models/auction");
const {User} = require('../../models/user');  
const jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;
const geolib = require('geolib'); // for distance calculation



router.get("/", async (req, res) => { 

    // this returns -1 if user is not logged in otherwise returns the user id
    const isLoggedIn = async (req) => {
        try{
            //if token is missing
            if(req.header('Authorization') == null || req.header('Authorization') == ""){
                return -1;
            }

            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
            const rootUser = await User.findOne({_id: ObjectId(decoded._id)});

            if (!rootUser || rootUser==null) {
                return -1;
            }
            return decoded._id;
    }
    catch (e) {
        //if JWT is malformed
        return -1;
    }}

    let userLoggedIn = await isLoggedIn(req); 
    let user;
    let userlatitude,userlongitude;
    if(userLoggedIn!= -1){
        // finding the user that is cuurently logged in and then setting the values of latitude and longitude
        user = await User.findOne({_id: ObjectId(userLoggedIn)});
         userlatitude = user.latitude;
         userlongitude = user.longitude;
    }
    const requestedProductName = req.query.name;

    var responseData = []; //this is an array of objects
    
    let products = await Product.find({ productName :{ $regex : '.*'+ requestedProductName + '.*', $options: 'i' }});
    pIdList = []  // stores id of all products that match the query entered by the user

    for(var i=0;i<products.length;i++)
    {
        pIdList.push(products[i]._id);
    }

    let auction = await Auction.find({ product: pIdList}); // finding the auctions of all products which have their id in the pId list
    
    for(var i=products.length-1 ; i >=0; i--){

        var productDetails = {}; // this will hold a single object containing all relevant details needed frontend

        productDetails.SNo = products.length-i;
        productDetails.productId = products[i]._id;
        productDetails.productName = products[i].productName;
        productDetails.basePrice = products[i].productBasePrice;
        productDetails.img = products[i].productImage;
        productDetails.shipment = products[i].shipmentFromPlace;

        if(userLoggedIn!= -1){
                 
             productDetails.dist = geolib.getDistance({ latitude: userlatitude,longitude: userlongitude}, 
                { latitude:products[i].shipmentFromLatitude,longitude: products[i].shipmentFromLongitude});

            productDetails.userLoggedIn = true;
        }
        else{
            productDetails.userLoggedIn = false;
            productDetails.dist = -1;
        }
          
        let formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction[i].endDateTime);

        let formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction[i].startDateTime)

        productDetails.EndTime= formattedEndTime;
        productDetails.StartTime= formattedStartTime;
        productDetails.fEndTime= auction[i].endDateTime;
        productDetails.fStartTime= auction[i].startDateTime;

        if(auction[i].auctionLive){ // this status will be used for filtering of products
            productDetails.status = "Present";
        }
        else if(auction[i].auctionStarted){
            productDetails.status = "Past";
        }
        else{
            productDetails.status = "Future";
        }
        responseData.push(productDetails);
    }

    //returns the array of objects
    res.status(200).send(responseData); 
});

module.exports = router;
