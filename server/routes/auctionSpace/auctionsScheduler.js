const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");
require("dotenv").config();

// declaring global variables for usage across different functions
var subscribers = "";
let sellerEmail = "";
let soldToEmail = "";
let soldToName = "";
let sellerName = "";
let productCurrentPrice = 0;

async function findSubscribersOfThisProduct(auction) {
  // finds subscribers of the given auction product and saves it in the global string subscribers
  const auctionOfThatProduct = await Auction.findOne({ _id: auction._id });
  const subscribersOfThatProduct = auctionOfThatProduct.subscribers;
  const userDBOfSubscribers = await User.find({
    _id: subscribersOfThatProduct,
  });
  for (let i = 0; i < userDBOfSubscribers.length; i++) {
    subscribers += userDBOfSubscribers[i].email + ", ";
  }
}

async function findSoldToBuyer(auction) {
  // finds buyer of that particular auction product after auction ends
  const auctionOfThatProduct = await Auction.findOne({ _id: auction._id });
  const buyerID = auctionOfThatProduct.currentBidder;
  const buyer = await User.findOne({ _id: buyerID });
  if (buyer) {
    soldToName = buyer.name;
    soldToEmail = buyer.email;
  }
}

async function sellerOfThisProduct(auction) {
  // finds the seller of the particular auction product
  const product = await Product.findOne({ _id: auction.product });
  const sellerID = product.seller;
  const seller = await User.findOne({ _id: sellerID });
  sellerEmail = seller.email;
  sellerName = seller.name;
}

const emailNotification = (receiver, subject, text) => {
  // sends email notification to the receiver using nodemailer

  // transporter stores the email provider's details
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SERVICE_PROVIDER_USER,
      pass: process.env.SERVICE_PROVIDER_PASSKEY,
    },
  });

  // mailoptions stores the receiver and sender's mail id and the subject along with inside content or text
  var mailOptions = {
    from: "auctionwebsitedesisproject@gmail.com",
    to: "shreyasristi2003@gmail.com",
    subject: subject,
    text: text,
  };

  // email gets sent using sendMail() function
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

async function startAuction(auction) {
  await Auction.findOneAndUpdate(
    { _id: auction._id },
    {
      auctionStarted: true,
      auctionLive: true,
    }
  );
}

async function endAuction(auction) {
  // storing the current (latest) data of this auction and updating it
  const currAuction = await Auction.findOneAndUpdate(
    { _id: auction._id },
    {
      auctionEnded: true,
      auctionLive: false,
    }
  );
  // check to see if there is atleast 1 bid, at the end time (i.e., in current auction )
  if (currAuction.bids.length) {
    const maxBidder = currAuction.bids[0].bidder;
    productCurrentPrice = currAuction.bids[0].price;
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
        $push: { purchasedProducts: auction.product },
      }
    );
  }
}

async function scheduleReminder(auction) {
  // finds the reminder date and time based on 24 hours difference from start date and time
  const reminderDateTime = new Date(
    new Date(auction.startDateTime).getTime() - 60 * 60 * 24 * 1000
  );
  // schedules the reminder date and time using scheduleJob attribute of node-schedule npm package
  const reminderAuctionJob = schedule.scheduleJob(
    reminderDateTime,
    async function () {
      // finds the subscribers of this product
      findSubscribersOfThisProduct(auction);
      // sends emails to the subscribers
      emailNotification(
        subscribers,
        "Reminder! Auction is going to start in 24 hours",
        `The auction of ${auction.productName} is going to start in 24 hours`
      );
    }
  );
}

async function scheduleStart(auction) {
  // finds subscribers of the product
  findSubscribersOfThisProduct(auction);
  // finds the seller of the product
  await sellerOfThisProduct(auction);
  // adds up the seller email id in the subscribers receiver's string
  subscribers += sellerEmail;
  if (auction.startDateTime < new Date()) {
    // notify seller and subscribers that the auction started late
    startAuction(auction);

    // sends emails to the subscribers and seller of the product
    emailNotification(
      subscribers,
      "Sorry! the auction started late",
      `The auction of ${auction.productName} started late due to a technical glitch. Kindly tune in now as it got started now.`
    );
  } else {
    // scheduling the auction to start at its start time
    const startAuctionJob = schedule.scheduleJob(
      auction.startDateTime,
      async function () {
        startAuction(auction);
        // sends emails to the subscribers and seller of the product
        emailNotification(
          subscribers,
          "The auction has just started now",
          `The auction of ${auction.productName} has just started, kindly tune in.`
        );
      }
    );
  }
}

async function scheduleEnd(auction) {
  if (auction.endDateTime < new Date()) {
    // ending the auction late
    endAuction(auction);
    // finds the buyer of the product after the auction ends
    await findSoldToBuyer(auction);
    // sends emails to the buyer and seller of the product
    emailNotification(
      soldToEmail + "," + sellerEmail,
      "Sorry! The auction has ended late",
      `The auction of ${auction.productName} has ended now due to a technical glitch. The product has been sold to ${soldToName} by the seller ${sellerName} at a price of Rupees ${productCurrentPrice}`
    );
  } else {
    // scheduling the auction to end at its end time
    const endAuctionJob = schedule.scheduleJob(
      auction.endDateTime,
      async function () {
        endAuction(auction);
        // finds the buyer of the product after the auction ends
        await findSoldToBuyer(auction);
        // sends emails to the buyer and seller of the product
        emailNotification(
          soldToEmail + ", " + sellerEmail,
          "Congratulations! The auction has ended",
          `The auction of ${auction.productName} has ended now. The product has been sold to ${soldToName} by the seller ${sellerName} at a price of Rupees ${productCurrentPrice}`
        );
      }
    );
  }
}

function scheduleAll() {
  async function auctionsStartScheduler() {
    // finding all auctions that will start within 1 hour
    const auctions = await Auction.find({
      startDateTime: {
        //  $gte: new Date(),
        $lte: new Date(new Date().getTime() + 60 * 60 * 1000),
      },
      auctionStarted: false,
    });
    console.log("start-", auctions.length);

    for (var i = 0; i < auctions.length; i++) {
      scheduleStart(auctions[i]);
    }
  }

  async function auctionsEndScheduler() {
    // find all auctions that will end within 1 hour
    const auctions = await Auction.find({
      endDateTime: {
        //  $gte: new Date(),
        $lte: new Date(new Date().getTime() + 60 * 60 * 1000),
      },
      auctionEnded: false,
    });
    console.log("end-", auctions.length);

    for (var i = 0; i < auctions.length; i++) {
      scheduleEnd(auctions[i]);
    }
  }

  auctionsStartScheduler();
  auctionsEndScheduler();

  // running auctions start and end schedulers every 50 mins
  let startTimeInterval = setInterval(async () => {
    auctionsStartScheduler();
    auctionsEndScheduler();
  }, 50 * 60 * 1000); //runs every 50 mins
}

module.exports.scheduleAll = scheduleAll;
module.exports.scheduleReminder = scheduleReminder;
module.exports.scheduleStart = scheduleStart;
module.exports.scheduleEnd = scheduleEnd;
