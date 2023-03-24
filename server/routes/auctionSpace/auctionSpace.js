const { Auction } = require("../../models/auction");
const { User } = require("../../models/user");
const { Product } = require("../../models/product");
var ObjectId = require('mongoose').Types.ObjectId;
const router = require("express").Router() ;

function getStatus(auction) {
  var auctionStatus;
  if(!auction.auctionStarted)
    {
      auctionStatus="Yet to start";
    }
    else if (!auction.auctionEnded)
    {
      auctionStatus="Ongoing";
    }
    else 
    {
      auctionStatus="Ended";
    }
    return auctionStatus;
}

  
router.get("/", async (req, res) => {

  try {
    const productId = req.query.id;
    const product= await Product.findOne({_id: productId});
    const auction = await Auction.findOne( { product: productId } );
    const bidsList= auction.bids;
    const responseData={};
    
    // getting status of the auction
    var auctionStatus= getStatus(auction);
    

    const formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.endDateTime);
    const formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.startDateTime);
    

    responseData.bidsList= bidsList;
    responseData.currPrice= bidsList.length ? bidsList[0].price : auction.basePrice;
    responseData.basePrice=product.productBasePrice;
    responseData.productName=product.productName;
    responseData.auctionLive= auction.auctionLive;
    responseData.endDateTime= formattedEndTime;
    responseData.startDateTime= formattedStartTime;
    responseData.auctionEnded= auction.auctionEnded;
    responseData.auctionStatus=auctionStatus;
    responseData.seller=product.seller;
    responseData.loggedInUser= req.id;

    
    if(auction.soldTo){
      const soldToUser = await User.findOne({_id: auction.soldTo});
      responseData.soldTo= soldToUser.name;
    }
       
    // sending the response data with the required attributes
      res.status(200).send({responseData: responseData});
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });



router.post("/", async (req, res) => {
    const bidderId = req.id ;
    const productId= req.body.productId;
    const bidder= await User.findOne({_id: bidderId});
    const auction = await Auction.findOne({ product: productId });
    const formattedCurrentTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(new Date());
//new bid object
    const bid = {
      bidder: ObjectId(bidderId),
      bidderName: bidder.name,
      price: req.body.price,
      time: formattedCurrentTime
    };

    await Auction.findOneAndUpdate(
      { product: productId }, 
      { 
        $push: { 
                bids: {
                  $each: [bid],
                  $position: binarySearch(auction.bids, bid.price)
                }
              },
      }
    );

    // Binary search to find the index where the new bid should be inserted
    function binarySearch(bids, price) {
      let low = 0, high = bids.length - 1;
      while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (bids[mid].price >= price) {
          low = mid + 1;
        } 
        else {
          high = mid - 1;
        }
      }
      return low;
    }

    res.json(req.body);
});


router.get("/onlyAuction", async (req, res) => {

  try {
    const productId = req.query.id;
    const auction = await Auction.findOne( { product: productId } );
    const bidsList= auction.bids;
    const responseData={};

    // getting status of the auction
    var auctionStatus= getStatus(auction);

    responseData.bidsList= bidsList;
    responseData.currPrice= bidsList.length ? bidsList[0].price : auction.basePrice;
    responseData.auctionLive= auction.auctionLive;
    responseData.auctionEnded= auction.auctionEnded;
    responseData.auctionStatus=auctionStatus;
    
    if(auction.soldTo){
      const soldToUser = await User.findOne({_id: auction.soldTo});
      responseData.soldTo= soldToUser.name;
    }
       
    // sending the response data with the required attributes
    res.status(200).send({responseData: responseData});
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
    
  });

  router.get("/timer", async (req, res) => {

    try {
      const productId = req.query.id;
      const auction = await Auction.findOne( { product: productId } );
      const responseData={};

      const timeLeft=  new Date(auction.endDateTime)- new Date();
      responseData.timeLeft= timeLeft;
      responseData.endTime= auction.endDateTime;
      res.json(responseData);
      
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
      
    });

module.exports = router;
