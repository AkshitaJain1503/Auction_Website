
const { Contact } = require("../../models/contact");
var ObjectId = require('mongoose').Types.ObjectId;
const router = require("express").Router() ;
router.get("/", async (req, res) => {

    try {
      const id = req.query.id;
      const contact= await Contact.find({userId: ObjectId(id)});
      //console.log("this is"+id);
      res.json(contact);
     // res.status(200).send(contact);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

router.post("/", async (req, res) => {
  try{
    var contact={};
    contact.userId=ObjectId(req.body.idSeller);
    contact.myName=req.body.sellerName;
    contact.chatRoomId=req.body.room;
    contact.contactName=req.body.username;
    contact.contactUserId=ObjectId(req.body.idUser);
    const contct = await new Contact(contact).save();
    //await Contact.insertOne(contct);
    res.json(req.body);
  }
  catch(error){
    console.log("contact already present");
    res.status(200).send("contact already present");
  }
});

module.exports = router;
