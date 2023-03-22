
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
router.get("/seller",async(req,res)=>{
  try {
    const id = req.query.id;
    const contact= await Contact.find({contactUserId: ObjectId(id)});
    //console.log("this is"+id);
    res.json(contact);
   // res.status(200).send(contact);
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
    //const contct = await new Contact(contact).save();
    //await Contact.insertOne(contct);
    const contct = await Contact.findOne({chatRoomId: contact.chatRoomId});
    console.log(contct);
    if(contct!=null){
      //console.log(Contact.findOne({chatRoomId: contact.chatRoomId}).data);
    Contact.findOneAndUpdate({chatRoomId: contact.chatRoomId},contact,async function(err){
                if (err){
                    const contct = await new Contact(contact).save();
                    console.log("failed");
                    res.status(500).send({data:"failed"});}
                else
                    console.log("succesful");
                    res.status(200).send({data:"updated successfully"});
              }
        )
            }
            else{
              //console.log(Contact.findOne({chatRoomId: contact.chatRoomId}));
                  const contct = await new Contact(contact).save();
                  res.json(req.body);
            }
    //res.json(req.body);
  }
  catch(error){
    console.log("contact already present");
    res.status(200).send("contact already present");
  }
});
// router.patch("/",async(req,res)=>{
//   var newValues ={... req.body};
//   roomId=req.query.roomId;
//   console.log(newValues.userReadStatus);
//   Contact.findOneAndUpdate({chatRoomId: roomId},newValues,function(err){
//           if (err)
//               res.status(500).send({data:"failed"});
//           else
//               res.status(200).send({data:"updated successfully"});
//         }
//   )
// })
// router.patch("/", async (req, res) => {
//   //values given for updation.
//   roomId=req.query.roomId;
//   Id=req.query.id;
//   //var newValues =  {... req.body} ;
//   try{
//     console.log("ursula");
//     Contact.findOneAndUpdate({ $and : [{chatRoomId: roomId},{contactUserId:Id}]}, {userReadStatus:true},function(err){
//       if (err)
//           res.status(500).send({data:"failed"});
//       else
//           res.status(200).send({data:"updated successfully"});
//     }
//     )
//   }
//   catch{
//     Contact.findOneAndUpdate({ $and : [{chatRoomId: roomId},{userId:Id}]}, {userReadStatus:false},function(err){
//       if (err)
//           res.status(500).send({data:"failed"});
//       else
//           res.status(200).send({data:"updated successfully"});
//     })
//   }
  
//   //updating data where user Id is derived from the token's Id via middleware
//   // Contact.findOneAndUpdate({ $and : [{chatRoomId: roomId},{myName:Name}]}, newValues, function (err) {
//   //     if (err)
//   //         res.status(500).send({data:"please try again after sometime"});
//   //     else
//   //         res.status(200).send({data:"updated successfully"});
//   //   }); 
// });


module.exports = router;
