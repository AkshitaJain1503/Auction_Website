const mongoose= require('mongoose')

// const bid= new Schema({
//     bidder: {
//         type: mongoose.Types.ObjectId,
//         ref: 'User',
//     },
//     time: {
//         type: Date, 
//         default: Date.now
//     },
//     price:  { 
//         type: Number,
//         required: true 
//     }
// })

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
    productBasePrice:{
        type: Number,
        required: true
    },
    currentBidder: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    // auctionStartTime: Date,
    // auctionStartDate: Date,
    // endTime: Date,
    // duration: Number,
    auctionStartDate: {
        type: String,
        required: true
    },
    auctionStartTime: {
        type: String,
        required: true
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