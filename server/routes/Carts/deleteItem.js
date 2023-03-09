// cart section
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");
var ObjectId = require('mongoose').Types.ObjectId;

router.get("/", async (req, res) => {
  const auction_id = req.query.item;
  const user_id = req.id;
  console.log("auction");
  console.log(auction_id + "o");
  console.log("oih");
  console.log(user_id);
  await User.updateOne(
    { _id: user_id },
    {
      $pull: { "watchList": `${ObjectId(auction_id)}` },
    }
  );
  const user = await User.findOne({_id: user_id});
  console.log(user.watchList);
  res.send("It is done now");
  // console.log(auction_id._id);
});

module.exports = router;
