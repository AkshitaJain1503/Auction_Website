// post product details
const router = require("express").Router();
const multer = require('multer');
const {v4: uuidv4} = require("uuid");
const path = require("path");
const {Product} = require("../../models/product");
const {Auction} = require("../../models/auction");
const {User} = require("../../models/user");
var ObjectId = require('mongoose').Types.ObjectId;
const {cloudinary} = require("./cloudinary");
require("dotenv").config();
const schedule = require('node-schedule');

const storage = multer.diskStorage({
    // destination: function(req, file, cb) {
    //     cb(null, "images");
    // },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

let upload = multer({storage, fileFilter});

router.post("/", upload.single("productImage"), async (req, res) => {

    console.log("data fetched");
    const sellerId = req.id;
    const startDateTime= req.body.startDateTime;
    const seperatedStartDate= startDateTime.split("T");
    const startDate= seperatedStartDate[0];
    // const auctionStartDate = req.body.auctionStartDate;
    // const auctionStartTime = req.body.auctionStartTime;
    // const days = req.body.days;
    // const hours = req.body.hours;
    // const minutes = req.body.minutes;
    const endDateTime =req.body.endDateTime;
    // const duration = { days: days,  hours:hours, minutes: minutes }
    
    const result = await cloudinary.uploader.upload(req.file.path);

    const productImage = result.secure_url;

//Adding product details and sellerID in the product model.
    const product = await new Product({ ... req.body, productImage: productImage, seller: sellerId}).save();

    const auction = await new Auction({product: product._id, productName:product.productName , startDateTime, startDate:startDate, endDateTime:endDateTime, productCurrentPrice: product.productBasePrice}).save();
//adding ProductID against the specific seller in the user model. 
    await User.findOneAndUpdate(
        { _id: ObjectId(sellerId) }, 
        { $push: { postedProducts: ObjectId(product._id) }}
    );

// scheduling the auction to start at the start time
    const startAuction =  schedule.scheduleJob(startDateTime,async function() {
        console.log(`Auction has started for ${product.productName}!`);
        await Auction.findOneAndUpdate(
            { _id: auction._id }, 
            { 
                auctionStarted: true,
                auctionLive: true,
            }
        );
    });
// scheduling the auction to end at the end time
    const endAuction = schedule.scheduleJob(endDateTime, async function() {
        console.log(`Auction has ended for ${product.productName}!`);
        const currAuction= await Auction.findOneAndUpdate(
            { _id: auction._id }, 
            { 
                auctionEnded: true,
                auctionLive: false,
            }
        )
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
                        $push: { purchasedProducts: ObjectId(product._id) }
                    }
                    );
                
            }
        
    });

//     async function endAuction () {
//         console.log(`Auction has ended for ${product.productName}!`);
//         auction.auctionEnded= true;
//         auction.auctionLive= false;
//         if( auction.bids.length )
//         {
//             auction.soldTo= auction.currentBidder;
//             const soldTo = await User.findOneAndUpdate(
//                 {_id: auction.soldTo},
//                 {
//                     $push: { purchasedProducts: ObjectId(product._id) }
//                 }
//                 );
//         }
//     };

// // setting timer for this auction
// function startTimer( callback) {
  
//     let timerInterval = setInterval(() => {
  
//     if( auction.duration.minutes )
//     {
//         auction.duration.minutes--;
//     }
//     else if (auction.duration.hours)
//     {
//         auction.duration.hours--; 
//         auction.duration.minutes+=59;
//     }
//     else if(auction.duration.days)
//     {
//         auction.duration.days--; 
//         auction.duration.hours+=23; 
//         auction.duration.minutes+=59;
//     }
//     else {
//         clearInterval(timerInterval);
//         callback();
//       }
//       console.log(`${auction.duration.days}:${auction.duration.hours}:${auction.duration.minutes}`);
//     }, 60000); // every 1 minute
//   }
  
//     startTimer( () => {
//     console.log("Timer ended!");
//     endAuction();
//   });

    // req.id = product._id;
    res.json(product._id);
    // console.log(req.body);
});
module.exports = router;
