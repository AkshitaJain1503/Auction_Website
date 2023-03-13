// cart section
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");
var ObjectId = require('mongoose').Types.ObjectId;

router.get("/", async (req, res) => {
  const auction_id = req.query.item;
  const user_id = req.id;
  await User.updateOne(
    { _id: user_id },
    {
      $pull: { "watchList": `${ObjectId(auction_id)}` },
    }
  );
  res.send("It is done now");
});

module.exports = router;
