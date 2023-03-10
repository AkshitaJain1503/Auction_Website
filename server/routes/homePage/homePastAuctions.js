const express = require("express");
const mongoose = require("mongoose");
const { Auction } = require("../../models/auction");
const { Product } = require("../../models/product");
const router = require("express").Router() ;
router.get("/", async (req, res) => {
    try{
      const auctions = await Auction.find({auctionEnded : true});
      const products = [];
      const length=auctions.length;
      for(var i=length-1;i>=0;i--){
        const prod=await Product.findOne({_id : auctions[i].product});
        if(prod!=null){
        products.push(prod);}
      }
      res.status(200).send(products); 
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  module.exports=router;