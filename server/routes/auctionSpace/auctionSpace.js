const { Auction } = require("../../models/auction");
const { User } = require("../../models/user");
var ObjectId = require('mongoose').Types.ObjectId;
const router = require("express").Router() ;

router.get("/", async (req, res) => {
    const productId = req.query.id;
    try {
        
      const data = await Auction.findOne( { product: productId } , {bids: 1});
      // list of bids of the requested product
      const bids= data.bids;
      const responseData=[];

      for(var i=bids.length-1 ; i >=0; i--){
        // converting the date into standard date-time format 
        const formattedTime= new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(bids[i].time);
        const bidder = await User.findOne({_id: bids[i].bidder});

        const bid={};
        bid.id=bids[i]._id;
        bid.price= bids[i].price;
        bid.time= formattedTime;
        bid.bidderFirstName= bidder.firstName;
        // bid.bidderLastName= bidder.lastName;

        responseData.push(bid);
    }
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
    //pushing the posted bid in the auction object
    await Auction.findOneAndUpdate(
        { product: productId }, 
        { $push: { bids: {
            bidder: ObjectId(bidderId),
            price: req.body.price
        } }}
    );
    res.json(req.body);
});

module.exports = router;
