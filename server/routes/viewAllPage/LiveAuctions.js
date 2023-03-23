const express = require("express");
const mongoose = require("mongoose");
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const router = require("express").Router() ;
router.get("/", async (req, res) => {
    try{
      const auctions = await Auction.find({auctionLive : true});
      const length=auctions.length;
      const productIds=[];
      for(var i=length-1;i>=0;i--){
        productIds.push(auctions[i].product);
      }
      const products=await Product.find({_id : productIds});
      var responseData=[];
      for(var i=length-1;i>=0;i--){
        var productDetails = {}; // this will hold a single object
        productDetails.SNo = products.length-i;
        productDetails.productId = products[i]._id;
        productDetails.productName = products[i].productName;
        productDetails.basePrice = products[i].productBasePrice;
        productDetails.img = products[i].productImage;
        productDetails.shipment = products[i].shipmentFromPlace;
         let formattedEndTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
         day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auctions[i].endDateTime);
        let formattedStartTime= new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(auctions[i].startDateTime)
        productDetails.EndTime= formattedEndTime;
        productDetails.StartTime= formattedStartTime;
        productDetails.fEndTime= auctions[i].endDateTime;
        productDetails.fStartTime= auctions[i].startDateTime;
        responseData.push(productDetails);
      }
      res.status(200).send(responseData);  
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  module.exports=router;