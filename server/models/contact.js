const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    
  },
  contactName: {
    type:String,
    required: true,
  },
  myName: {
    type:String,
    required: true,
  },
  contactUserId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chatRoomId:{
    type:String,
    unique: true,
    required: true,
  },
  productName:{
    type:String,
    required:true,
  },
  userReadStatus:{
    type:Boolean,
    default: false,
  },
  contactReadStatus:{
    type:Boolean,
    default: true,
  }
});
const Contact = mongoose.model("contact", contactSchema);
module.exports = {Contact};