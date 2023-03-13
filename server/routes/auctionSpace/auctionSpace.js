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
    const bidsList= auction.bids;
    const responseData={};

    // sorting bids in descending order of price
    bidsList.sort((a, b) => {
      return b.price-a.price;
    });
    
    // getting status of the auction
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
    

    responseData.bidsList= bidsList;
    responseData.currPrice=auction.productCurrentPrice;
    responseData.productName=product.productName;
    responseData.auctionLive= auction.auctionLive;
    responseData.endDateTime= formattedEndTime;
    responseData.startDateTime= formattedStartTime;
    responseData.auctionEnded= auction.auctionEnded;
    responseData.status=status;
    responseData.seller=product.seller;
    responseData.loggedInUser= req.id;
    
    if(auction.soldTo){
      const soldToUser = await User.findOne({_id: auction.soldTo});
      responseData.soldTo= soldToUser.name;
    }
       
    // sending the response data with the required attributes
      res.json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });



router.post("/", async (req, res) => {
    const bidderId = req.id ;
    const bidder= await User.findOne({_id: bidderId});
    const productId= req.body.productId;
    const postedPrice= req.body.price;
    const formattedCurrentTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(new Date());
    
    const auctionId = await Auction.findOneAndUpdate(
        { product: productId }, 
        { 
          //pushing the posted bid in the auction object
          $push: { bids: {
            bidder: ObjectId(bidderId),
            bidderName: bidder.name,
            price: req.body.price,
            time: formattedCurrentTime
          }},
      }
    );

    const maxPrice= auctionId.productCurrentPrice;
    // when the current bid is the highest bid so far
    if(postedPrice>maxPrice)
    {
      await Auction.findOneAndUpdate(
        { product: productId }, 
        { 
          //updating the product current price
          productCurrentPrice: req.body.price,
          //updating the current highest bidder
          currentBidder: req.id,
      }
    );
      
  }
    res.json(req.body);
});


router.get("/onlyAuction", async (req, res) => {

  try {
    const productId = req.query.id;
    const auction = await Auction.findOne( { product: productId } );
    const bidsList= auction.bids;
    const responseData={};

    // sorting bids in descending order of price
    bidsList.sort((a, b) => {
      return b.price-a.price;
    });
    
    // getting status of the auction
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

    responseData.bidsList= bidsList;
    responseData.currPrice=auction.productCurrentPrice;
    responseData.auctionLive= auction.auctionLive;
    responseData.auctionEnded= auction.auctionEnded;
    responseData.status=status;
    
    if(auction.soldTo){
      const soldToUser = await User.findOne({_id: auction.soldTo});
      responseData.soldTo= soldToUser.name;
    }
       
    // sending the response data with the required attributes
      res.json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
