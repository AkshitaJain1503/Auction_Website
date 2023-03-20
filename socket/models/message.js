const mongoose = require("mongoose");
var messageSchema = new mongoose.Schema({
    roomId: {
        type :String,
         required: true,
    },
    from: {
        type:String,
        // type: mongoose.Types.ObjectId,
        // ref: 'User',
        required: true,
      },
    to: {
        type:String,
        // type: mongoose.Types.ObjectId,
        // ref: 'User',
         required: true,
      },
    messageBody: {  // body of the message(text body)
        type: String,
         required: true,
      },
    time: { // when was this message created
        type: Date,
        default: new Date(Date.now()).getHours() +
             ":" +
            new Date(Date.now()).getMinutes(),
            required: true,
    },
  

});

const Message = mongoose.model("message", messageSchema);

module.exports = {Message};