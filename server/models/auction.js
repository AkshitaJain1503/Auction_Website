const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    bids: [
      {
        bidder: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true
        },
        bidderName: {
          type: String,
          required: true,
        },
        time: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    basePrice: {
      type: Number,
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    auctionLive: {
      type: Boolean,
      default: false,
    },
    auctionStarted: {
      type: Boolean,
      default: false,
    },
    auctionEnded: {
      type: Boolean,
      default: false,
    },
    subscribers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    soldTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Auction = mongoose.model("auction", auctionSchema);

module.exports = { Auction };
