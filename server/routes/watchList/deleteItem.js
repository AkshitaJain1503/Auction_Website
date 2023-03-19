// remove an item from the watchlist
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");
var ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (req, res) => {
  // obtain the auction id through backend url query
  const auction_id = req.query.item;

  // obtaining the id of logged in user
  const user_id = req.id;

  // go to user document of logged in user, and remove the id of the given item from the watchlist array
  await User.updateOne(
    { _id: user_id },
    {
      $pull: { watchList: `${ObjectId(auction_id)}` },
    }
  );

  // go to auction document of that particular item and remove the user id from its subscribers array
  await Auction.updateOne(
    { _id: auction_id },
    {
      $pull: { subscribers: `${ObjectId(user_id)}` },
    }
  );

  // sending response to the client side that the item got removed from watchlist
  res.status(200).send("Item got removed.");
});

module.exports = router;
