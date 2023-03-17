// post product details
const router = require("express").Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { Product } = require("../../models/product");
const { Auction } = require("../../models/auction");
const { User } = require("../../models/user");
var ObjectId = require("mongoose").Types.ObjectId;
const { cloudinary } = require("./cloudinary");
require("dotenv").config();
// const schedule = require('node-schedule');
const auctionsScheduler = require("../auctionSpace/auctionsScheduler");

const storage = multer.diskStorage({
  // destination: function(req, file, cb) {
  //     cb(null, "images");
  // },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.post("/", upload.single("productImage"), async (req, res) => {
  console.log("data fetched");
  const sellerId = req.id;
  const startDateTime = req.body.startDateTime;
  const seperatedStartDate = startDateTime.split("T");
  const startDate = seperatedStartDate[0];
  const endDateTime = req.body.endDateTime;

  const result = await cloudinary.uploader.upload(req.file.path);

  const productImage = result.secure_url;

  //Adding product details and sellerID in the product model.
  const product = await new Product({
    ...req.body,
    productImage: productImage,
    seller: sellerId,
  }).save();

  const auction = await new Auction({
    product: product._id,
    productName: product.productName,
    startDateTime,
    startDate: startDate,
    endDateTime: endDateTime,
    productCurrentPrice: product.productBasePrice,
  }).save();

  //scheduling start and end of this auction
  auctionsScheduler.scheduleReminder(auction);
  auctionsScheduler.scheduleStart(auction);
  auctionsScheduler.scheduleEnd(auction);

  //adding ProductID against the specific seller in the user model.
  await User.findOneAndUpdate(
    { _id: ObjectId(sellerId) },
    { $push: { postedProducts: ObjectId(product._id) } }
  );

  res.json(product._id);
});
module.exports = router;
