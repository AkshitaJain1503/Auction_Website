// add to watchlist section
const router = require("express").Router();
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (req, res) => {
  // adding the item to the watchlist

  // obtaining the product id through url query
  const product_id = req.query.id;

  // obtaining logged in user through url query
  const user_id = req.id;

  // obtaining auction document of that particular product
  const auction = await Auction.findOne({ product: product_id });

  // obtaining the user document of logged in user
  let user = await User.findOne({ _id: user_id });

  // obtaining watchlist products of the logged in user
  const watchListProducts = user.watchList;

  // condition whether the product to be added in watchlist is already present in watchlist or not ( assuming that it is not already present)
  let isPresent = false;

  for (let i = 0; i < watchListProducts.length; i++) {
    // checking in each watchlist products whether the product in concern is already present or not in watchlist
    if (`${watchListProducts[i]}` == `${auction._id}`) {
      isPresent = true;
    }
  }

  // if not present, update the new product in the watchlist
  if (!isPresent) {
    // append auction id of that product in user document
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        $push: { watchList: auction._id },
      }
    );

    // append user id of loggedin user in auction document
    await Auction.findOneAndUpdate(
      { _id: auction._id },
      {
        $push: { subscribers: user_id },
      }
    );
  }

  // sending response status OK and response as product added to the client side
  res.status(200).send(`Product is added to watchlist!`);
});

module.exports = router;
