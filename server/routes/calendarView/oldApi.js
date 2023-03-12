const router = require("express").Router();
const {Auction} = require("../../models/auction");

//Get unique dates from auction db corresponding to the searched product name for calendar display.
router.get("/", async (req, res) => {

    const requestedProductName = req.query.name;
    let response =[];

    let todayDate = dateConverter(String(new Date()));

    //getting distinct DATE-TIME where name LIKE %requestedProductName%.
    let AuctionList= await Auction.find().distinct("startDateTime",
    { productName :{ $regex : '.*'+ requestedProductName + '.*', $options: 'i' } });
    
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
            colour = "#774dbf";
        }
        else if(todayDate > auctDate){
            colour = "#bf6d4d";
        }
        else{
            colour = "#9bbf4d";
        }
        return colour;
    }


    //only if AuctionList contains something.
    if(AuctionList.length!=0){
        AuctionList.sort();
        let uniqueDate = dateConverter(String(AuctionList[0]));
        let resData = {date: (AuctionList[0]), color: decideColour(todayDate, uniqueDate)};
        response.push(resData); 

        //getting only UNIQUE DATES
        for(var i=0 ; i < AuctionList.length; i++){
            let resData = {};
            let currentDate = dateConverter(String(AuctionList[i]));

            if(currentDate == uniqueDate){
                continue;
            }
            else{
                uniqueDate = currentDate
            }

            resData.date = (AuctionList[i]);

            let colour = decideColour(todayDate,currentDate);
            resData.color = colour;
            
            response.push(resData)

        }
    }
    res.status(200).send({data:response});
});


module.exports = router;




