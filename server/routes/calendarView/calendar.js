//Get details of the products corresponding to the searched term: GET
const router = require("express").Router();
const {Auction} = require("../../models/auction");

//Get documents from auction collection corresponding to the searched product name for initial calendar display.
router.get("/", async (req, res) => {

    const requestedProductName = req.query.name;

    //to extract only date from the date-time type format
    function dateConverter(str){
        var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
        year = date.getFullYear();
        return `${year}/${mnth}/${day}`
     }
     
    //deciding colour which will highlight the calendar according to past, today and future.
    function decideColour(todayDate, auctDate){
        if(todayDate < auctDate){
            return "#774dbf";
        }
        if(todayDate > auctDate){
            return "#7f7c82";
        }
        return "#2c9119";
    }

    let todayDate = dateConverter(String(new Date()));

    //getting auction documents where name LIKE %requestedProductName% (sql equivalent) and is case insensitive.
    let AuctionList= await Auction.find({ productName 
        :{ $regex : '.*'+ requestedProductName + '.*', $options: 'i' } });

    let response =[];

    //details needed at the front-end.
    for(var i = 0; i<AuctionList.length; i++){
        let resData = {};
        let auctDate = (AuctionList[i]. startDateTime);
        resData.date = auctDate;
        resData.title = AuctionList[i]. productName;
        resData.color = decideColour(todayDate,dateConverter(auctDate));
        resData.id = AuctionList[i]._id;
        response.push(resData);
    };

    //returns array of objects {data: [{},{},{}...]}
    res.status(200).send({data:response});
});

module.exports = router;



