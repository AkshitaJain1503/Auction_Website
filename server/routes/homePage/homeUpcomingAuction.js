const express = require("express");
const mongoose = require("mongoose");
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const router = require("express").Router() ;
router.get("/", async (req, res) => {
    try{
      const auctions = await Auction.find({auctionStarted : false});
      const length=auctions.length;
      const productIds=[];
      for(var i=length-1;i>=0;i--){
        productIds.push(auctions[i].product);
      }
      const products=await Product.find({_id : productIds});
      res.status(200).send(products); 
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  module.exports=router;