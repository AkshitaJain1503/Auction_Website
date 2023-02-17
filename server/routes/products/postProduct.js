// post product details
const router = require("express").Router();
const {Product} = require("../../models/product");

router.post("/", async (req, res) => {
    const {productName, productDescription, productBasePrice, shipmentFrom, productImage} = req.body;
    console.log("data fetched");
    const product = new Product({ productName, productDescription, productBasePrice, shipmentFrom, productImage});
    console.log(product);
    // await new Product({...req.body, productImage: productImage}).save();
    
    product.save();
    res.json(req.body);
});

module.exports = router;
