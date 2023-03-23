const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const { User } = require("../../models/user");
require("dotenv").config();

// update the auction document so that all the info stays upto date 
async function updateAuction(auction) {
  return await Auction.findOne({ _id: auction._id });
}

async function findSubscribersOfThisProduct(auction) {
  // finds subscribers of the given auction product and saves it in the global string subscribers
  auction = await updateAuction(auction);
  const subscribersOfThatProduct = await auction.subscribers;
  const userDBOfSubscribers = await User.find({
    _id: subscribersOfThatProduct,
  });
  var subscribers = "";
  for (let i = 0; i < userDBOfSubscribers.length; i++) {
    subscribers += userDBOfSubscribers[i].email + ", ";
  }
  return subscribers;
}

async function findSoldToBuyer(auction) {
  // finds buyer of that particular auction product after auction ends
  auction = await updateAuction(auction);
  const buyerID = await auction.currentBidder;
  const buyer = await User.findOne({ _id: buyerID });
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
    to: "shreyasristi2003@gmail.com",
    subject: subject,
    html: text,
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
      // sends emails to the subscribers
      emailNotification(
        subscribers,
        `Reminder! Auction of ${auction.productName} is going to start in 24 hours`,
        `<h4> Dear Subscriber, <h4> 
        </br> 
        <p>The auction of ${auction.productName} is going to start in 24 hours<p>
        <h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${auction.product}">Auction Details</a> </h5>`
      );
    }
  );
}

async function scheduleStart(auction) {
  // finds subscribers of the product
  var subscribers = await findSubscribersOfThisProduct(auction);
  // finds the seller of the product
  var seller = await sellerOfThisProduct(auction);
  if (auction.startDateTime < new Date()) {
    // notify seller and subscribers that the auction started late
    startAuction(auction);

    // finds the time difference
    var timeDifference = new Date(new Date() - auction.startDateTime);

    // sends emails to the subscribers
    emailNotification(
      subscribers,
      `Sorry, the auction of ${auction.productName} started late`,
      `<h4> Dear Subscriber, <h4> </br> <p>The auction of ${auction.productName
      } started ${timeDifference.getDate() - 1} days, ${timeDifference.getHours() - 5} hours, ${timeDifference.getMinutes() - 30} minutes, ${timeDifference.getSeconds()} seconds late due to a technical glitch.</p>
      <h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${auction.product
      }">Auction Details</a> </h5>`
    );

    // sends emails to the seller of the product
    emailNotification(
      seller.email,
      `Sorry! the auction of ${auction.productName} started late`,
      `<h4>Dear ${seller.name
      }, </h4> </br> <p> The auction of your product <b>${auction.productName
      }</b> started ${timeDifference.getDate() - 1} days, ${timeDifference.getHours() - 5} hours, ${timeDifference.getMinutes() - 30} minutes, ${timeDifference.getSeconds()} seconds late due to a technical glitch.</p>
      <h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${auction.product
      }">Auction Details</a> </h5>`
    );
  } else {
    // scheduling the auction to start at its start time
    const startAuctionJob = schedule.scheduleJob(
      auction.startDateTime,
      async function () {
        startAuction(auction);
        // sends emails to the subscribers
        emailNotification(
          subscribers,
          `The auction of ${auction.productName} has just started now`,
          `<h4>Dear Subscriber, </h4>
          </br>
          <p> The auction of your subscribed product <b>${auction.productName}</b> has just started now </p>
          <h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${auction.product}">Auction Details</a> </h5>`
        );
        // send emails to the seller of the product
        emailNotification(
          seller.email,
          `The auction of ${auction.productName} has just started now`,
          `<h4>Dear ${seller.name}, </h4>
          </br>
          <p> The auction of your product <b>${auction.productName}</b> has just started now </p>
          <h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${auction.product}">Auction Details</a> </h5>`
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
    var productCurrentPrice = updatedAuction.productCurrentPrice;

    var timeDifference = new Date(new Date() - auction.endDateTime);

    // if the auction did not happen for that product, as in, if no bids were placed
    // send mail to seller informing the issue
    if (!buyer) {
      emailNotification(
        seller.email,
        `Sorry! The auction of ${auction.productName} has ended late but product not sold`,
        `<h4>Dear ${seller.name},</h4> </br> <p>The product ${auction.productName
        } has ended ${timeDifference.getDate() - 1} days, ${timeDifference.getHours() - 5
        } hours, ${timeDifference.getMinutes() - 30
        } minutes late due to a technical glitch. But we regret to inform you that not even a single bid got placed on your product, thereby, the product went as not sold.</p>
      <h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${auction.product
        }">Auction Details</a> </h5>`
      );
    } else {
      // sends email to the buyer of the product
      emailNotification(
        buyer.email,
        `Sorry! The auction of ${auction.productName} has ended late`,
        `<h4> Dear ${buyer.name}, </h4> </br> <p>The product ${auction.productName
        } has ended ${timeDifference.getDate() - 1} days, ${timeDifference.getHours() - 5
        } hours, ${timeDifference.getMinutes() - 30
        } minutes late due to a technical glitch. The product has been sold to you by the seller ${seller.name
        } at a price of &#8377; ${productCurrentPrice}</p><h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${auction.product
        }">Auction Details</a> </h5>`
      );
      // send email to the seller of the product
      emailNotification(
        seller.email,
        `Sorry! The auction of ${auction.productName} has ended late`,
        `<h4> Dear ${seller.name}, </h4> </br> <p>The product ${auction.productName
        } has ended ${timeDifference.getDate() - 1} days, ${timeDifference.getHours() - 5
        } hours, ${timeDifference.getMinutes() - 30
        } minutes late due to a technical glitch. Your product has been sold to ${buyer.name
        } at a price of &#8377; ${productCurrentPrice}</p><h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${auction.product
        }">Auction Details</a> </h5>`
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
        var productCurrentPrice = updatedAuction.productCurrentPrice;


        // if the auction did not happen for that product, as in, if no bids were placed
        // send mail to seller informing the issue
        if (!buyer) {
          emailNotification(
            seller.email,
            `Sorry! The auction of ${auction.productName} has ended now but product not sold`,
            `<h4>Dear ${seller.name},</h4> </br> <p>The product ${auction.productName
            } has ended now. But we regret to inform you that not even a single bid got placed on your product, thereby, the product went as not sold.</p>
      <h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${auction.product
            }">Auction Details</a> </h5>`
          );
        } else {
          // sends email to the buyer 
          emailNotification(
            buyer.email,
            `Congratulations! The auction of ${auction.productName} has ended now`,
            `<h4>Dear ${buyer.name},</h4> </br> <p> The auction of ${auction.productName} has ended now.The product has been sold to you by the seller ${seller.name
            } at a price of &#8377; ${productCurrentPrice}</p><h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${auction.product
            }">Auction Details</a> </h5>`
          )
          // sends mail to the seller of the product
          emailNotification(
            seller.email,
            `Congratulations! The auction of ${auction.productName} has ended now`,
            `<h4>Dear ${seller.name},</h4> </br> <p> The auction of ${auction.productName} has ended now. Your product has been sold to ${buyer.name
            } at a price of &#8377; ${productCurrentPrice}</p><h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${auction.product
            }">Auction Details</a> </h5>`
          );
        }
      }
    );
  }
}

function scheduleAll() {
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
