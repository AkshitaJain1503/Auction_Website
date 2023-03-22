
require('dotenv').config()
const mongoose = require('mongoose');
const mongoDB = process.env.DB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected')
}).catch(err => console.log(err))

var messageSchema = new mongoose.Schema({
    roomId: {
        type :String,
    },
    from: {
        type:String,
      },
    to: {
        type:String,
      },
    messageBody: {  
        type: String,
      },
       time: {
        type:String,
    },

   
});
const Message = mongoose.model("message", messageSchema);
module.exports = {Message};
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
app.set('port',8900);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection",(socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room",async (data) => {
    socket.join(data);
    try {
      const messages = await Message.find({roomId:data});
      socket.emit('history', messages);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("send_message", async(data) => {
    const message = new Message(data);
    await message.save();
    socket.to(data.roomId).emit('receive_message', message);
  });
  
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(8900, async() => {
  console.log("SERVER RUNNING");
});