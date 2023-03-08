const router = require("express").Router();
const {Product} = require("../../models/product");
const {Auction} = require("../../models/auction");


//Get the buyer or seller (user) profile data.
router.get("/", async (req, res) => {

    const requestedProductName = req.query.name;
    const requestedDate = req.query.date;
    console.log(requestedDate,"requestedDate");
    let AuctList = Auction.find( { productName: requestedProductName , productCurrentPrice: requestedDate } );
    console.log("AuctList",AuctList);
    //var productdata = {}

    // to avoid hitting the DB query in a loop, writing a SQL equivalent IN query.
    //writing a SQL equivalent LIKE Operator query.
    //$options: 'i' ensures case insensitivity.
    // let ProductList = await Product.find({ productName :{ $regex : '.*'+ requestedProductName + '.*', $options: 'i' }});


    // let AuctionList = await Auction.find({startDateTime: requestedDate});

    // console.log("ProductList==>",ProductList)
    // console.log("AuctionList==>",AuctionList)
    // let ProductIdList = [];
    // for(var i=0 ; i < ProductList.length; i++){
    //     let ProductId = ProductList[i]._id;
    //     ProductIdList.push(ProductId);
    // }

    

    // let response = [];
    // let auctionData = {};

    // //returns {pId:Date, pId:Date, ....}
    // for(var i=0 ; i < AuctionList.length; i++){
    //     let ProductId = AuctionList[i].product;
    //     auctionData[ProductId] = AuctionList[i].startDateTime;
    // }

    // //returns [{date: date,title: name, color: colour},{},{},....]
    // for(var i=0 ; i < ProductList.length; i++){
    //     let resData = {};
    //     let prodData = ProductList[i];
    //     prodID = prodData._id;
    //     let name = prodData.productName;
    //     let auctDate = auctionData[prodID];
    //     resData.date = auctDate;
    //     resData.title = name;
    //     // var dateObj = new Date(auctDate);
    //     // var month = dateObj.getUTCMonth(); //months from 1-12
    //     // var date = dateObj.getUTCDate();
    //     // var year = dateObj.getUTCFullYear();
    //     // var resDate = new Date(year, month, date)
    //     // console.log(dateObj,"dateObj");
    //     // console.log(auctDate,"auctDate");
    //     // resData.date = resDate;

    //     // let indianDateTody = JustADate(new Date()).toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
    //     // let auctDateCompare = JustADate(new Date(auctDate)).toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
    //     // let auctDateCompare = new Date(auctDate).toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
    //     // console.log(indianDateTody,"indianDateToday");
    //     // console.log(auctDateCompare,"resDate");
        
    //     // console.log(auctDate,"auctDate");
    //     // console.log(new Date(auctDate),"auctDateNew");
    //     let todayDate = new Date();
    //     // console.log(todayDate,"todayDate");
    //     // let indianDateTody= new Date().toISOString().split("T")[0];
    //     // let auctDateCompare = new Date(auctDate).toISOString().split("T")[0];
    //     // console.log(indianDateTody,"indianDateToday");
    //     // console.log(auctDateCompare,"resDate");
    //     // console.log("compare", indianDate> resDateCompare);
    //     let colour;
    //     if(todayDate < auctDate){
    //         colour = "#774dbf";
    //     }
    //     else if(todayDate > auctDate){
    //         colour = "#bf6d4d";
    //     }
    //     else{
    //         colour = "#9bbf4d";
    //     }
    //     resData.color = colour;

    //     response.push(resData)
    // }

    res.status(200).send({data:"hi"});
});


module.exports = router;

