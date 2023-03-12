const router = require("express").Router();
const {Auction} = require("../../models/auction");

//Get documents from auction db corresponding to the searched product name for calendar display.
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
            return "#504e52";
        }
        return "#144a0a";
    }

    let todayDate = dateConverter(String(new Date()));

    //getting auction documents where name LIKE %requestedProductName% and is case insensitive.
    let AuctionList= await Auction.find({ productName 
        :{ $regex : '.*'+ requestedProductName + '.*', $options: 'i' } });

    let response =[];

    //final response array of objects.
    for(var i = 0; i<AuctionList.length; i++){
        let resData = {};
        let auctDate = (AuctionList[i]. startDateTime);
        resData.date = auctDate;
        resData.title = AuctionList[i]. productName;
        resData.color = decideColour(todayDate,dateConverter(auctDate));
        resData.id = AuctionList[i]._id;
        response.push(resData);
    };

    res.status(200).send({data:response});
});

module.exports = router;



