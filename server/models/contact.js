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
    // type: mongoose.Types.ObjectId,
    // ref: 'ChatRoom'
    type:String,
    unique: true,
    required: true,
  }
});
const Contact = mongoose.model("contact", contactSchema);
module.exports = {Contact};