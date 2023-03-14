const schedule = require('node-schedule');
const {Auction} = require("../../models/auction");
const { User } = require("../../models/user");

 function auctionsScheduler () {

    async function auctionStartScheduler(){
        // finding all auctions that will start within 1 hour
        const auctions= await Auction.find({
            startDateTime: {
               $gte: new Date(),
               $lte: new Date(new Date().getTime() + 60 * 60 * 1000)
            },
            auctionStarted: false
         });
         console.log("start-", auctions.length);

         for (var i = 0; i < auctions.length; i++) {
            // capturing the value of "i" and storing as "index", since scheduler is an asynchronous function
            (function(index) {
            //scheduling auctions[index] to start at its start time
              const startAuction = schedule.scheduleJob(auctions[index].startDateTime, async function() {
                await Auction.findOneAndUpdate(
                  { _id: auctions[index]._id },
                  {
                    auctionStarted: true,
                    auctionLive: true,
                  }
                );
              });
            })(i);
          }
    }

    async function auctionEndScheduler(){
        // find all auctions that will end within 1 hour
        const auctions= await Auction.find({
            endDateTime: {
               $gte: new Date(),
               $lte: new Date(new Date().getTime() + 60 * 60 * 1000)
            },
            auctionEnded: false
         });
         console.log("end-", auctions.length);

         for (var i = 0; i < auctions.length; i++) {
            (function(index) {
            // scheduling the auctions[index] to end at the end time
            const endAuction = schedule.scheduleJob(auctions[index].endDateTime, async function() {
                // storing the current (latest) data of this auction and updating it
                const currAuction= await Auction.findOneAndUpdate(
                    { _id: auctions[index]._id }, 
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
                            { _id: auctions[index]._id }, 
                            { 
                                soldTo: maxBidder
                            }
                        )
                        // adding this product in the purchased products array of the highest bidder
                        await User.findOneAndUpdate(
                            {_id: maxBidder},
                            {
                                $push: { purchasedProducts: auctions[index].product }
                            });
                    }
            });
            })(i);
          }
 
    }

    auctionStartScheduler();
    auctionEndScheduler();

    // running auction start and end schedulers every 50 mins
    let startTimeInterval = setInterval(async() => {

        auctionStartScheduler();
        auctionEndScheduler();

      }, 50 * 60 * 1000); //runs every 50 mins


}

module.exports= auctionsScheduler;
