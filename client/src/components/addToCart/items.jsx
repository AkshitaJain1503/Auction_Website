import React from "react";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Items = ({ auction_id, product_id, productImage, productName, productDescription, currentPrice}) => {

  
  const navigate = useNavigate();
    

  // const [item, removedItem] = useState('');

  const getItems = async () => {
    const myHeaders = new Headers({
      "Authorization": "Bearer "+localStorage.getItem("token")
    });
    const response = await fetch(
      "http://localhost:3001/api/removeItem?item=" + auction_id, {
        method:"GET",
        headers: myHeaders
      }  
    );
    if(response) {
      window.location.reload(false);
    }
  }

  const removeItem = () => {
    // removedItem(id);
    getItems();
  }



  const GoToAuction = () => {
    navigate(`/auctionSpace?id=${product_id}`);
  }

  return (
    <>
      <div className="items-info">
        <div className="product-img">
          <img src={productImage} alt="arrow"></img>
        </div>
        <div className="title">
          <h2>{productName}</h2>
          {/* <p>{productDescription}</p> */}
        </div>
        {/* <div className="add-minus-quantity">
          <i className="fas fa-minus minus"></i>
          <input type="text" placeholder="2" />
          <i className="fas fa-plus"></i>
        </div> */}
        <div className="price">
          <h3><span> Current Price: </span> {currentPrice}</h3>
        </div>
        <div className="price">
          <button className="watch-btn" onClick={GoToAuction}>Watch</button>
        </div>
        <div className="remove-item">
          <i className="fas fa-trash-alt add remove" onClick={() => removeItem()}></i>
        </div>
      </div>
      <hr />
    </>
  );
};

export default Items;
