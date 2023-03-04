const mongoose= require('mongoose')

const auctionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    bids: [ {
        bidder: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        time: {
            type: Date, 
            default: Date.now
        },
        price:  { 
            type: Number,
            required: true 
        }
    } ] ,
    productCurrentPrice:{
        type: Number,
        required: true
    },
    currentBidder: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        // required: true
    },
    duration: {
        type: String,
        required: true
    },
    auctionLive: {
        type: Boolean,
        default: false
    }, 
    auctionStarted : {
        type: Boolean,
        default: false
    }, 
    auctionEnded: {
        type: Boolean,
        default: false
    }, 
    subscribers: [ {
        users: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    } ],
    soldTo: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    
}
,{ timestamps: true }

)

const Auction = mongoose.model("auction", auctionSchema);

module.exports = {Auction};