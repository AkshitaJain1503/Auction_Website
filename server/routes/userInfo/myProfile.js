//My Profile: GET and Update data (PATCH)
const router = require("express").Router();
const {User} = require("../../models/user");

//Get my profile data.
router.get("/", async (req, res) => {
    var userData = {}
    //getting data corresponding to user ID from the token via middleware for my Profile
    const user = await User.findOne({_id: req.id});
    userData._id=user._id;
    userData.name = user.name;
    userData.email = user.email;
    userData.address = user.address;
    userData.country = user.country;
    userData.state = user.state;
    userData.city = user.city;
    userData.totalPosts = user.postedProducts.length;
    userData.totalPurchases = user.purchasedProducts.length;

    res.status(200).send({data:userData});
});


//Update my profile data.
router.patch("/", async (req, res) => {

    //values given for updation.
    var newValues =  {... req.body} ;

    //updating data where user Id is derived from the token's Id via middleware
    User.findOneAndUpdate({_id: req.id}, newValues, function (err) {
        if (err)
            res.status(500).send({data:"please try again after sometime"});
        else
            res.status(200).send({data:"updated successfully"});
      }); 
});


module.exports = router;



