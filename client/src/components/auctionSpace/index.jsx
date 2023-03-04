import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavLoggedIn from "../navbar/navLoggedIn";
import styles from "./styles.module.css";
import {Form, Button, Input} from "reactstrap"

var maxBid = 0;

const Auction = () => {

  const { state } = useLocation();
  const { productId } = state;
  // console.log("pr", productId) ;

  const [data, setInput] = useState({
    price: "",
    productId: productId 
  });
  const [bids, setBids] = useState([]);

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setInput({ ...data, [name]: value });
  };

  const addBid = async (e) => {

    e.preventDefault();
    const {
        price,
        productId
      } = data;
  
  //POST method to send bid price entered by the user
    const res = await fetch("http://localhost:3001/api/auctionSpace" , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("token")
      },
      body: JSON.stringify({price, productId})
    }).catch((err)=> console.log(err));

    const result= await res.json();
    if (result.status === 404 || !result) {
        window.location = "/signup";
      } else {
        alert('bid submitted');
        setInput({price:""});
    };
}

// GET request for getting the bids data
useEffect(() => {
  fetch("http://localhost:3001/api/auctionSpace?id=" + productId , {
        headers: { "Authorization": "Bearer "+localStorage.getItem("token")}
      })
    .then(response => response.json())
    .then(data => 
      {
        console.log("data", data);
        setBids(data)
      }
    )
    .catch(error => console.error(error));
}, []);

// displaying all the bids of the current product
  const bidTable = bids.map((bid) => (
    <tr key={bid.id}>
      <td>
        <a href="/"> {bid.bidderFirstName} </a>
      </td>
      <td> {bid.price} </td>
      <td> {bid.time} </td>
    </tr>
  ));

  return (
    <div>

      <NavLoggedIn/>

      <h1> Auction Space </h1>
      <div className={styles.auctionSpace}>
      <Form 
        onSubmit={addBid} 
        method="POST" 
        >
        <input
          id="pr"
          type="text"
          name="price"
          value={data.price}
          onChange= {handleInput}
        />

        <Button type="submit"
          className="btn btn-dark bid-btn">
          bid
        </Button>
        </Form>
        <div>
          <div className="AuctionTab">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>{bidTable}</tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Auction;
