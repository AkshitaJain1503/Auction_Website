const schedule = require('node-schedule');
const {Auction} = require("../../models/auction");
const { User } = require("../../models/user");

async function startAuction(auction){
  await Auction.findOneAndUpdate(
    { _id: auction._id },
    {
      auctionStarted: true,
      auctionLive: true,
    });
}

async function endAuction(auction){
  // storing the current (latest) data of this auction and updating it
  const currAuction= await Auction.findOneAndUpdate(
    { _id: auction._id }, 
    { 
        auctionEnded: true,
        auctionLive: false,
    }
)
// check to see if there is atleast 1 bid, at the end time (i.e., in current auction )
if( currAuction.bids.length )
    {
        const maxBidder= currAuction.currentBidder;
        // product sold to the max bidder
        await Auction.findOneAndUpdate(
            { _id: auction._id }, 
            { 
                soldTo: maxBidder
            }
        )
        // adding this product in the purchased products array of the highest bidder
        await User.findOneAndUpdate(
            {_id: maxBidder},
            {
                $push: { purchasedProducts: auction.product }
            });
    }

}

async function scheduleStart(auction){
  if(auction.startDateTime<new Date()){
    // notify seller and subscribers that the auction started late
    startAuction(auction);
  }
  else {
    // scheduling the auction to start at its start time
    const startAuctionJob = schedule.scheduleJob(auction.startDateTime, async function() {
      startAuction(auction);
    });
  }
}

function scheduleEnd(auction){
  if(auction.endDateTime<new Date()){
    // ending the auction late
    endAuction(auction);
  }
  else {
    // scheduling the auction to end at its end time
    const endAuctionJob = schedule.scheduleJob(auction.endDateTime, async function() {
      endAuction(auction);
    });
  }
}

 function scheduleAll () {

    async function auctionsStartScheduler(){
        // finding all auctions that will start within 1 hour
        const auctions= await Auction.find({
            startDateTime: {
              //  $gte: new Date(),
               $lte: new Date(new Date().getTime() + 60 * 60 * 1000)
            },
            auctionStarted: false
         });
         console.log("start-", auctions.length);

         for (var i = 0; i < auctions.length; i++) {
          scheduleStart(auctions[i]);
          }
    }

    async function auctionsEndScheduler(){
        // find all auctions that will end within 1 hour
        const auctions= await Auction.find({
            endDateTime: {
              //  $gte: new Date(),
               $lte: new Date(new Date().getTime() + 60 * 60 * 1000)
            },
            auctionEnded: false
         });
         console.log("end-", auctions.length);

         for (var i = 0; i < auctions.length; i++) {
            scheduleEnd(auctions[i]);
          }
 
    }

    auctionsStartScheduler();
    auctionsEndScheduler();

    // running auctions start and end schedulers every 50 mins
    let startTimeInterval = setInterval(async() => {

        auctionsStartScheduler();
        auctionsEndScheduler();

      }, 50* 60 * 1000); //runs every 50 mins


}

module.exports.scheduleAll= scheduleAll;
module.exports.scheduleStart= scheduleStart;
module.exports.scheduleEnd= scheduleEnd;
