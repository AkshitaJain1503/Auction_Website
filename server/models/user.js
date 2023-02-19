//Creating User Model
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    // phone: {
    //     type: String,
    //     required: true,
    // },
    address: {
        type: String,
        required: true,
    },
    purchasedProducts: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
    ],
    postedProducts: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
    ],
    //   bids: [
    //     {
    //       type: mongoose.Types.ObjectId,
    //       ref: 'Product',
    //     },
    // ]
});

//generate jwt 
//this token will expire in 7 days as mentioned.
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
    return token;
};

//User model named as "user" with userSchema
const User = mongoose.model("user", userSchema);

module.exports = {User};

