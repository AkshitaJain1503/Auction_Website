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
<<<<<<< HEAD
const schedule = require("node-schedule");
var nodemailer = require("nodemailer");
=======
// const schedule = require('node-schedule');
const auctionsScheduler = require("../auctionSpace/auctionsScheduler");
>>>>>>> f468057b38cf672395bba67d25c782f887961b66

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
  // const auctionStartDate = req.body.auctionStartDate;
  // const auctionStartTime = req.body.auctionStartTime;
  // const days = req.body.days;
  // const hours = req.body.hours;
  // const minutes = req.body.minutes;
  const endDateTime = req.body.endDateTime;
  // const duration = { days: days,  hours:hours, minutes: minutes }

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
  //adding ProductID against the specific seller in the user model.
  await User.findOneAndUpdate(
    { _id: ObjectId(sellerId) },
    { $push: { postedProducts: ObjectId(product._id) } }
  );

  const reminderDateTime = new Date(
    new Date(startDateTime).getTime() - 60 * 60 * 24 * 1000
  );

  
  const reminderAuction = schedule.scheduleJob(
    reminderDateTime,
    async function () {
      // const soldTo = await User.findOne({_id: maxBidder});
      //         const soldToName = soldTo.name;
      //         // const soldToEmail = soldTo.email;
      const prodAuction = await Auction.findById({_id: auction._id});
      const subscribers = prodAuction.subscribers;
      var receiversList = "";
      for(let i = 0; i < subscribers.length; i++) {
        const subscriber = await User.findById({_id: subscribers[i]});
        receiversList += subscriber.email + ",";        
      }
      console.log(receiversList);
      const soldToEmail = "shreyasristi2003@gmail.com, ss2563@cse.jgec.ac.in";
      const soldToProduct = product.productName;
      console.log(soldToEmail, soldToProduct);

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "auctionwebsitedesisproject@gmail.com",
          pass: "mcwxzkykchkgwyaj",
        },
      });

      var mailOptions = {
        from: "auctionwebsitedesisproject@gmail.com",
        to: `${soldToEmail}`,
        subject: `Reminder! Auction of ${soldToProduct} is about to start in 24 hours`,
        text: `The auction for ${soldToProduct} is about to start in 24 hours. Kindly tune in when it starts.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  );

  // scheduling the auction to start at the start time
  const startAuction = schedule.scheduleJob(startDateTime, async function () {
    
    console.log(`Auction has started for ${product.productName}!`);
  // const subscribers = auction.subscribers;
  // console.log(subscribers);

    const productImage = result.secure_url;

//Adding product details and sellerID in the product model.
    const product = await new Product({ ... req.body, productImage: productImage, seller: sellerId}).save();

    const auction = await new Auction({product: product._id, productName:product.productName , startDateTime, startDate:startDate, endDateTime:endDateTime, productCurrentPrice: product.productBasePrice}).save();

    //scheduling start and end of this auction
    auctionsScheduler.scheduleStart(auction);
    auctionsScheduler.scheduleEnd(auction);
    
//adding ProductID against the specific seller in the user model. 
    await User.findOneAndUpdate(
        { _id: ObjectId(sellerId) }, 
        { $push: { postedProducts: ObjectId(product._id) }}
    );
  });
  // scheduling the auction to end at the end time
  const endAuction = schedule.scheduleJob(endDateTime, async function () {
    console.log(`Auction has ended for ${product.productName}!`);
    const prodAuction = await Auction.findById({_id: auction._id});
      const subscribers = prodAuction.subscribers;
      var receiversList = "";
      for(let i = 0; i < subscribers.length; i++) {
        const subscriber = await User.findById({_id: subscribers[i]});
        receiversList += subscriber.email + ", ";        
      }
      console.log(receiversList);
    const currAuction = await Auction.findOneAndUpdate(
      { _id: auction._id },
      {
        auctionEnded: true,
        auctionLive: false,
      }
    );
    if (currAuction.bids.length) {
      const maxBidder = currAuction.currentBidder;
      // product sold to the max bidder
      await Auction.findOneAndUpdate(
        { _id: auction._id },
        {
          soldTo: maxBidder,
        }
      );
      // adding this product in the purchased products array of the highest bidder
      await User.findOneAndUpdate(
        { _id: maxBidder },
        {
          $push: { purchasedProducts: ObjectId(product._id) },
        }
      );

    res.json(product._id);
});
module.exports = router;
