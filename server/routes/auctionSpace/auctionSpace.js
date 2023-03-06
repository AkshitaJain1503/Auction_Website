const { Auction } = require("../../models/auction");
const { User } = require("../../models/user");
const { Product } = require("../../models/product");
var ObjectId = require('mongoose').Types.ObjectId;
const router = require("express").Router() ;
  
  
router.get("/", async (req, res) => {

    try {
      const productId = req.query.id;
      const product= await Product.findOne({_id: productId});
      const auction = await Auction.findOne( { product: productId } );

      // list of bids of the requested product
      const bids= auction.bids;
      const responseData={};
      const bidsList=[];

      for(var i=bids.length-1 ; i >=0; i--){
        // converting the date into standard date-time format 
        const formattedTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(bids[i].time);

        const bidder = await User.findOne({_id: bids[i].bidder});

        const bid={};
        bid.id=bids[i]._id;
        bid.price= bids[i].price;
        bid.time= formattedTime;
        bid.bidderName= bidder.name;
        bid.bidderId=bids[i].bidder;

        bidsList.push(bid);
    }
    var status;
    if(!auction.auctionStarted)
    {
      status="Yet to start";
    }
    else if (!auction.auctionEnded)
    {
      status="Ongoing";
    }
    else 
    {
      status="Ended";
    }

    const formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.endDateTime);
    const formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auction.startDateTime);
    const soldTo = await User.findOne({_id: auction.soldTo});

    responseData.bidsList= bidsList;
    responseData.currPrice=auction.productCurrentPrice;
    responseData.productName=product.productName;
    responseData.auctionLive= auction.auctionLive;
    responseData.endDateTime= formattedEndTime;
    responseData.startDateTime= formattedStartTime;
    if(soldTo)
    responseData.soldTo= soldTo.name;
    // responseData.duration= auction.duration;
    responseData.status=status;

    // sending the bid data with the required attributes
      res.json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });



router.post("/", async (req, res) => {
    const bidderId = req.id ;
    const productId= req.body.productId;
    await Auction.findOneAndUpdate(
        { product: productId }, 
        { 
          //pushing the posted bid in the auction object
          $push: { bids: {
            bidder: ObjectId(bidderId),
            price: req.body.price
          }},
          //updating the product current price
          productCurrentPrice: req.body.price,
          //updating the current highest bidder
          currentBidder: req.id,
      }
    );
    res.json(req.body);
});

module.exports = router;
