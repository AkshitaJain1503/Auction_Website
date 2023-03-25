const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const { subjectStartNow } = require("../../emailContent");
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");
const content = require("../../emailContent");
require("dotenv").config();

// update the auction document so that all the info stays upto date 
async function updateAuction(auction) {
  return await Auction.findOne({ _id: auction._id });
}

async function findSubscribersOfThisProduct(auction) {
  // finds subscribers of the given auction product and saves it in the global string subscribers
  auction = await updateAuction(auction);
  const subscribersOfThatProduct = auction.subscribers;
  const userDBOfSubscribers = await User.find({
    _id: subscribersOfThatProduct,
  });
  var subscribers = "";
  for (var i = 0; i < userDBOfSubscribers.length; i++) {
    subscribers += userDBOfSubscribers[i].email + ", ";
  }
  return subscribers;
}

async function findSoldToBuyer(auction) {
  // finds buyer of that particular auction product after auction ends
  auction = await updateAuction(auction);
  var buyer = "null";
  if (auction.bids.length) {
    const buyerID = auction.bids[0].bidder;
    buyer = await User.findOne({ _id: buyerID });
  }
  return buyer;
}

async function sellerOfThisProduct(auction) {
  // finds the seller of the particular auction product
  const product = await Product.findOne({ _id: auction.product });
  const sellerID = product.seller;
  const seller = await User.findOne({ _id: sellerID });
  return seller;
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
    to: receiver,
    subject: subject,
    html: text,
  };

  // email gets sent using sendMail() function
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
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
      var subscribers = await findSubscribersOfThisProduct(auction);

      // email content send to subscribers for reminder of 24 hours
      var reminderToSubscribersMail = content.reminderToSubscribersMail(auction.productName, auction.product);

      // sends emails to the subscribers
      if (subscribers != "") {
        emailNotification(
          subscribers,
          content.subjectReminder(auction.productName),
          reminderToSubscribersMail
        );
      }
    }
  );
}

async function scheduleStart(auction) {

  if (auction.startDateTime < new Date()) {
    // notify seller and subscribers that the auction started late
    startAuction(auction);
    // finds subscribers of the product
    var subscribers = await findSubscribersOfThisProduct(auction);
    // finds the seller of the product
    var seller = await sellerOfThisProduct(auction);

    // finds the time difference
    var timeDifference = (new Date().getTime() - new Date(auction.startDateTime).getTime());
    var msec = timeDifference;
    var days = Math.floor(msec / 1000 / 60 / (60 * 24));
    msec -= days * 1000 * 60 * 60 * 24;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    // email content send to subscribers for late start of auction
    var emailSubscribersAuctionStartLate = content.emailSubscribersAuctionStartLate(auction.productName, auction.product, days, hh, mm, ss);

    // sends emails to the subscribers
    if (subscribers != "") {
      emailNotification(
        subscribers,
        content.subjectStartLate(auction.productName),
        emailSubscribersAuctionStartLate
      );
    }

    // email content of seller about auction late start
    var emailSellerAuctionStartLate = content.emailSellerAuctionStartLate(seller.name, auction.productName, days, hh, mm, ss, auction.product);

    // sends emails to the seller of the product
    emailNotification(
      seller.email,
      content.subjectStartLate(auction.productName),
      emailSellerAuctionStartLate
    );
  } else {
    // scheduling the auction to start at its start time
    const startAuctionJob = schedule.scheduleJob(
      auction.startDateTime,
      async function () {
        startAuction(auction);
        // finds subscribers of the product
        var subscribers = await findSubscribersOfThisProduct(auction);
        // finds the seller of the product
        var seller = await sellerOfThisProduct(auction);

        // email content send to subscribers about auction start
        var emailSubscribersAuctionStart = content.emailSubscribersAuctionStart(auction.productName, auction.product);

        // email content for auction start send to seller
        var emailSellerAuctionStart = content.emailSellerAuctionStart(auction.productName, seller.name, auction.product);

        // sends emails to the subscribers
        if (subscribers != "") {
          emailNotification(
            subscribers,
            content.subjectStartNow(auction.productName),
            emailSubscribersAuctionStart
          );
        }
        // send emails to the seller of the product
        emailNotification(
          seller.email,
          content.subjectStartNow(auction.productName),
          emailSellerAuctionStart
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
    var buyer = await findSoldToBuyer(auction);
    // finds the seller of the product
    var seller = await sellerOfThisProduct(auction);
    // finds product current price
    var updatedAuction = await updateAuction(auction);
    if (buyer != "null") {
      var productCurrentPrice = updatedAuction.bids[0].price;
    }

    // finds the time difference
    var timeDifference = (new Date().getTime() - auction.startDateTime.getTime());
    var msec = timeDifference;
    var days = Math.floor(msec / 1000 / 60 / (60 * 24));
    msec -= days * 1000 * 60 * 60 * 24;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    // without buyer email content for seller 
    var selleremailwithoutbuyer = email.selleremailwithoutbuyer(auction.productName, seller.name, days, hh, mm, auction.product);

    // if the auction did not happen for that product, as in, if no bids were placed
    // send mail to seller informing the issue
    if (buyer == "null") {
      emailNotification(
        seller.email,
        content.endLateNotSold(auction.productName),
        selleremailwithoutbuyer
      );
    } else {

      //email to buyer auction end late
      var emailBuyerAuctionEndLate = content.emailBuyerAuctionEndLate(auction.productName, buyer.name, days, hh, mm, seller.name, productCurrentPrice, auction.product);

      // email send to seller that product sold auction ended late
      var emailSellerAuctionEndLate = content.emailSellerAuctionEndLate(auction.productName, seller.name, days, hh, mm, buyer.name, productCurrentPrice, auction.product);

      // sends email to the buyer of the product
      emailNotification(
        buyer.email,
        content.endLate(auction.productName),
        emailBuyerAuctionEndLate
      );

      // send email to the seller of the product
      emailNotification(
        seller.email,
        content.endLate(auction.productName),
        emailSellerAuctionEndLate
      );
    }
  } else {
    // scheduling the auction to end at its end time
    const endAuctionJob = schedule.scheduleJob(
      auction.endDateTime,
      async function () {
        endAuction(auction);
        // finds the buyer of the product after the auction ends
        var buyer = await findSoldToBuyer(auction);
        // finds the seller of the product
        var seller = await sellerOfThisProduct(auction);
        // finds product current price
        var updatedAuction = await updateAuction(auction);
        if (buyer != "null") {
          var productCurrentPrice = updatedAuction.bids[0].price;
        }

        // email to seller without buyer
        var emailSellerAuctionEndWithoutBuyer = content.emailSellerAuctionEndWithoutBuyer(seller.name, auction.productName, auction.product);

        // if the auction did not happen for that product, as in, if no bids were placed
        // send mail to seller informing the issue
        if (buyer == "null") {
          emailNotification(
            seller.email,
            content.endNotSold(auction.productName),
            emailSellerAuctionEndWithoutBuyer
          );
        } else {

          //  email buyer auction ended, product sold to seller
          var emailBuyerAuctionEnd = content.emailBuyerAuctionEnd(buyer.name, auction.productName, seller.name, productCurrentPrice, auction.product);

          // sends email to the buyer 
          emailNotification(
            buyer.email,
            content.end(auction.productName),
            emailBuyerAuctionEnd
          )

          // email seller auction ended, and product sold to buyer
          var emailSellerAuctionEnd = content.emailSellerAuctionEnd(seller.name, auction.productName, buyer.name, productCurrentPrice, auction.product);

          // sends mail to the seller of the product
          emailNotification(
            seller.email,
            content.end(auction.productName),
            emailSellerAuctionEnd
          );
        }
      }
    );
  }
}

async function scheduleAll() {
  async function auctionReminderScheduler() {
    // finding all auctions that will start within 24 hours
    const auctions = await Auction.find({
      startDateTime: {
        $lte: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      },
      auctionStarted: false,
    });

    for (var i = 0; i < auctions.length; i++) {
      scheduleReminder(auctions[i]);
    }
  }

  async function auctionsStartScheduler() {
    // finding all auctions that will start within 1 hour
    const auctions = await Auction.find({
      startDateTime: {
        $lte: new Date(new Date().getTime() + 60 * 60 * 1000),
      },
      auctionStarted: false,
    });

    for (var i = 0; i < auctions.length; i++) {
      scheduleStart(auctions[i]);
    }
  }

  async function auctionsEndScheduler() {
    // find all auctions that will end within 1 hour
    const auctions = await Auction.find({
      endDateTime: {
        $lte: new Date(new Date().getTime() + 60 * 60 * 1000),
      },
      auctionEnded: false,
    });

    for (var i = 0; i < auctions.length; i++) {
      scheduleEnd(auctions[i]);
    }
  }

  auctionReminderScheduler();
  auctionsStartScheduler();
  auctionsEndScheduler();

  // running auctions start and end schedulers every 50 mins
  let startTimeInterval = setInterval(async () => {
    auctionReminderScheduler();
    auctionsStartScheduler();
    auctionsEndScheduler();
  }, 50 * 60 * 1000); //runs every 50 mins
}

module.exports.scheduleAll = scheduleAll;
module.exports.scheduleReminder = scheduleReminder;
module.exports.scheduleStart = scheduleStart;
module.exports.scheduleEnd = scheduleEnd;
