const router = require("express").Router();
const {User} = require("../../models/user");


//Get past products purchased as array value data.
router.get("/", async (req, res) => {
    var userData = {}

    const user = await User.findOne({_id: req.id});
    userData.purchasedProducts = user.purchasedProducts;
    

    res.status(200).send({data: userData});
});

module.exports = router;


