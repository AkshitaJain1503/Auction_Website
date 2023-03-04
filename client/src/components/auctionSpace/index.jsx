import React, { useState } from "react";
import NavLoggedIn from "../navbar/navLoggedIn";
import styles from "./styles.module.css";
import {Form, Button, Input} from "reactstrap"

var maxBid = 0;

const Auction = () => {

  const [data, setInput] = useState({
    price: ""
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
    // console.log("in addbid" , data, "price", data.price)
    if (data.price) {
        // console.log("in addbid data present")
      if (data.price> maxBid) {
        setBids([data, ...bids]);
        maxBid = data.price;
        // console.log("adding success")
      } else {
        // show message to set right price
        // console.log('not greater than current price ', maxBid, "data", data);
      }
    //   setInput({price:""});
    } else {
      // show a message to enter a valid bid
    }

    const {
        price,
        // bidder
      } = data;
      // console.log(price);
  

    const res = await fetch("http://localhost:3001/api/auctionSpace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+localStorage.getItem("token")
      },
      body: JSON.stringify({price})
    }).catch((err)=> console.log(err));

    const result= await res.json();
    if (result.status === 404 || !result) {
        window.location = "/signup";
      } else {
        alert('bid submitted');
    
    };
}


  const bidTable = bids.map((bid) => (
    <tr>
      <td>
        <a href="/"> User 1 </a>
      </td>
      <td> {bid.price} </td>
      <td> 00:00 </td>
    </tr>
  ));

  return (
    <div>

      <NavLoggedIn/>

      <h1> Auction Space </h1>
      <div className={styles.auctionSpace}>
        <div>
          <div className="AuctionTab">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col"> Name </th>
                  <th scope="col">Price</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>{bidTable}</tbody>
            </table>
          </div>
        </div>
        <Form 
        onSubmit={addBid} 
        method="POST" 
        >
        <Input
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
      </div>
    </div>
  );
};

export default Auction;

// hello helo
