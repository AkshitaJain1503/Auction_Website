// posting product in the server side
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
const auctionsScheduler = require("../auctionSpace/auctionsScheduler");

// storage is responsible for processing files uploaded through multer
// here it also allocates a unique file name to each file based on its extension and date
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

// fileFilter used as a middleware for checking whether the file type is valid or not
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// using multer for storage and file filter
let upload = multer({ storage, fileFilter });

router.post("/", upload.single("productImage"), async (req, res) => {
  // posting the product details in the backend server for storing in products and auctions document
  
  // obtaining the seller id from the logged in user id
  const sellerId = req.id;
  const startDateTime = req.body.startDateTime;
  const seperatedStartDate = startDateTime.split("T");
  const startDate = seperatedStartDate[0];
  const endDateTime = req.body.endDateTime;

  // using cloudinary, for cloud storage of uploaded image file
  const result = await cloudinary.uploader.upload(req.file.path);

  // obtaining secure url from cloudinary file storage, so that the image could be accessed easily with an URL
  const productImage = result.secure_url;

  //Adding product details and sellerID in the product model.
  const product = await new Product({
    ...req.body,
    productImage: productImage,
    seller: sellerId,
  }).save();

  // adding auction details in the auction model as an auction document
  const auction = await new Auction({
    product: product._id,
    productName: product.productName,
    startDateTime,
    startDate: startDate,
    endDateTime: endDateTime,
    basePrice: product.productBasePrice,
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

  // sending response that the product details got submitted successfully
  res.status(200).json(product._id);
});

module.exports = router;
