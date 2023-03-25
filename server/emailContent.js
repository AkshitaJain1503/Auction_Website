// all email content values
function reminderToSubscribersMail(productName, product) {
  return `<h4> Dear Subscriber, <h4> 
  </br> 
  <p>The auction of ${productName} is going to start in 24 hours<p>
  <h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${product}">Auction Details</a> </h5>`;
}

function emailSubscribersAuctionStartLate(productName, product, days, hh, mm, ss) {
  return `<h4> Dear Subscriber, <h4> </br> <p>The auction of ${productName
    } started ${days} days, ${hh} hours, ${mm} minutes, ${ss} seconds late due to a technical glitch.</p>
<h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${product
    }">Auction Details</a> </h5>`
}

function emailSellerAuctionStartLate(sellername, productName, days, hh, mm, ss, product) {
  return `<h4>Dear ${sellername
    }, </h4> </br> <p> The auction of your product <b>${productName
    }</b> started ${days} days, ${hh} hours, ${mm} minutes, ${ss} seconds late due to a technical glitch.</p>
  <h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${product
    }">Auction Details</a> </h5>`;
}

function emailSubscribersAuctionStart(productName, product) {
  return  `<h4>Dear Subscriber, </h4>
</br>
<p> The auction of your subscribed product <b>${productName}</b> has just started now </p>
<h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${product}">Auction Details</a> </h5>`;
}

function emailSellerAuctionStart(productName, sellername, product) {
  return `<h4>Dear ${sellername}, </h4>
  </br>
  <p> The auction of your product <b>${productName}</b> has just started now </p>
  <h5>If you wish to tune in, kindly click here: <a href="http://localhost:3000/auctionSpace?id=${product}">Auction Details</a> </h5>`;
}

function selleremailwithoutbuyer(productName, sellername, days, hh, mm, product) {
  return `<h4>Dear ${sellername},</h4> </br> <p>The product ${productName
    } has ended ${days} days, ${hh
    } hours, ${mm} minutes late due to a technical glitch. But we regret to inform you that not even a single bid got placed on your product, thereby, the product went as not sold.</p>
<h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${product
    }">Auction Details</a> </h5>`;
}

function emailBuyerAuctionEndLate(productName, buyername, days, hh, mm, sellername, productCurrentPrice, product) {
  return `<h4> Dear ${buyername}, </h4> </br> <p>The product ${productName
    } has ended ${days} days, ${hh
    } hours, ${mm
    } minutes late due to a technical glitch. The product has been sold to you by the seller ${sellername
    } at a price of &#8377; ${productCurrentPrice}</p><h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${product
    }">Auction Details</a> </h5>`;
}

function emailSellerAuctionEndLate(productName, sellername, days, hh, mm, buyername, productCurrentPrice, product) {
  return  `<h4> Dear ${sellername}, </h4> </br> <p>The product ${productName
  } has ended ${days} days, ${hh
  } hours, ${mm
  } minutes late due to a technical glitch. Your product has been sold to ${buyername
  } at a price of &#8377; ${productCurrentPrice}</p><h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${product
  }">Auction Details</a> </h5>`;
}

function emailSellerAuctionEndWithoutBuyer(sellername, productName, product) {
  return `<h4>Dear ${sellername},</h4> </br> <p>The product ${productName
  } has ended now. But we regret to inform you that not even a single bid got placed on your product, thereby, the product went as not sold.</p>
<h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${product
  }">Auction Details</a> </h5>`;
}

function emailBuyerAuctionEnd(buyername, productName, sellername, productCurrentPrice, product) {
  return `<h4>Dear ${buyername},</h4> </br> <p> The auction of ${productName} has ended now.The product has been sold to you by the seller ${sellername
  } at a price of &#8377; ${productCurrentPrice}</p><h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${product
  }">Auction Details</a> </h5>`;
}

function emailSellerAuctionEnd(sellername, productName, buyername, productCurrentPrice, product) {
  return `<h4>Dear ${sellername},</h4> </br> <p> The auction of ${productName} has ended now. Your product has been sold to ${buyername
  } at a price of &#8377; ${productCurrentPrice}</p><h5>To know more about your product auction status, visit <a href="http://localhost:3000/auctionSpace?id=${product
  }">Auction Details</a> </h5>`;
}

function subjectReminder(productName) {
  return `Reminder! Auction of ${productName} is going to start in 24 hours`;
}

function subjectStartLate(productName) {
  return `Sorry, the auction of ${productName} started late`;
}

function subjectStartNow(productName) {
  return  `The auction of ${productName} has just started now`;
}

function endLateNotSold(productName) {
 return `Sorry! The auction of ${productName} has ended late but product not sold`;
}

function endLate(productName) {
  return `Sorry! The auction of ${productName} has ended late`;
}

function endNotSold(productName) {
  return `Sorry! The auction of ${productName} has ended now but product not sold`;
}

function end(productName) {
  return `Congratulations! The auction of ${productName} has ended now`;
}

module.exports.reminderToSubscribersMail = reminderToSubscribersMail;
module.exports.emailSubscribersAuctionStartLate = emailSubscribersAuctionStartLate;
module.exports.emailSellerAuctionStartLate = emailSellerAuctionStartLate;
module.exports.emailSubscribersAuctionStart = emailSubscribersAuctionStart;
module.exports.emailSellerAuctionStart = emailSellerAuctionStart;
module.exports.selleremailwithoutbuyer = selleremailwithoutbuyer;
module.exports.emailBuyerAuctionEndLate = emailBuyerAuctionEndLate;
module.exports.emailSellerAuctionEndLate = emailSellerAuctionEndLate;
module.exports.emailSellerAuctionEndWithoutBuyer = emailSellerAuctionEndWithoutBuyer;
module.exports.emailBuyerAuctionEnd = emailBuyerAuctionEnd;
module.exports.emailSellerAuctionEnd = emailSellerAuctionEnd;
module.exports.subjectReminder = subjectReminder;
module.exports.subjectStartLate = subjectStartLate;
module.exports.subjectStartNow = subjectStartNow;
module.exports.endLateNotSold = endLateNotSold;
module.exports.endLate = endLate;
module.exports.endNotSold = endNotSold;
module.exports.end = end;