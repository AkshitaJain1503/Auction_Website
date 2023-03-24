// all watchlist products
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (req, res) => {
  // obtaining all watchlist products through get request

  // obtaining logged in user
  const user_id = req.id;

  // obtaining user document of logged in user
  let user = await User.findOne({ _id: user_id });

  // obtaining all products in the watchlist of the logged in user
  const watchListProducts = user.watchList;

  // obtaining list of auction document of the watchlist auctions ids
  const auctionList = await Auction.find({ _id: watchListProducts });

  // productIDList array for storing all the product ids of watchlist products
  var productIDList = [];

  for (let i = 0; i < auctionList.length; i++) {
    // pushing the product ids based on watchlist products auction id list
    productIDList.push(auctionList[i].product);
  }

  const productdB = await Product.find({ _id: productIDList });

  var watchList = [];
  for (let i = 0; i < productdB.length; i++) {
    // storing product name, description, current price, product image, auction id, product id, and auction start date time and end date time in an object `eachProduct`
    var eachProduct = {};
    eachProduct.productName = productdB[i].productName;
    eachProduct.currentPrice = auctionList[i].bids.length ? auctionList[i].bids[0].price : auctionList[i].basePrice;
    eachProduct.productImage = productdB[i].productImage;
    eachProduct.auction_id = auctionList[i]._id;
    eachProduct.product_id = productdB[i]._id;
    if (auctionList[i].auctionLive == true) {
      eachProduct.auctionStatus = "Live Auction";
    }
    else if (auctionList[i].auctionEnded == true && auctionList[i].auctionStarted == true) {
      eachProduct.auctionStatus = "Past Auction";
    }
    else {
      eachProduct.auctionStatus = "Upcoming Auction";
    }

    // finds the time difference
    var timeDifference = (new Date(auctionList[i].startDateTime).getTime() - new Date().getTime());
    var msec = timeDifference;
    var days = Math.floor(msec / 1000 / 60 / (60 * 24));
    msec -= days * 1000 * 60 * 60 * 24;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    eachProduct.dayDifference = days;
    eachProduct.hourDifference = hh;
    eachProduct.minutesDifference = mm;

    const formattedStartTime = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(auctionList[i].startDateTime);
    const formattedEndTime = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(auctionList[i].endDateTime);
    eachProduct.auctionStartDateTime = formattedStartTime;
    eachProduct.auctionEndDateTime = formattedEndTime;
    // watchList is an array of objects storing all necessary information about the products required for watchlist display
    watchList.push(eachProduct);
  }
  // sending the info to the client side for watchlist display
  res.status(200).send({ data: watchList });
});

module.exports = router;
