const { Contact } = require("../../models/contact");
var ObjectId = require('mongoose').Types.ObjectId;
const router = require("express").Router() ;
router.get("/", async (req, res) => {
    try {
      const id = req.query.id;
      const contact= await Contact.find({userId: ObjectId(id)});
      res.json(contact);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

router.get("/seller",async(req,res)=>{
  try {
    const id = req.query.id;
    const contact= await Contact.find({contactUserId: ObjectId(id)});
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
})

router.put("/", async (req, res) => {
  try{
    var contact={};
    contact.userId=ObjectId(req.body.idSeller);
    contact.myName=req.body.sellerName;
    contact.chatRoomId=req.body.room;
    contact.contactName=req.body.username;
    contact.contactUserId=ObjectId(req.body.idUser);
    contact.contactReadStatus=req.body.contactStatus;
    contact.userReadStatus=req.body.userStatus;
    contact.productName=req.body.productName;
    const contct = await Contact.findOne({chatRoomId: contact.chatRoomId});
    if(contct!=null){
    Contact.findOneAndUpdate({chatRoomId: contact.chatRoomId},contact,async function(err){
                if (err){
                    const contct = await new Contact(contact).save();
                    res.status(500).send({data:"failed"});}
                else
                    res.status(200).send({data:"updated successfully"});
              }
        )
    }
    else{
      const contct = await new Contact(contact).save();
      res.json(req.body);
    }
  }
  catch(error){
    res.status(200).send("contact already present");
  }
});


module.exports = router;
