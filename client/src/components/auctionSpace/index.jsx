import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../navbar/index";
import styles from "./styles.module.css";
import {Form, Button} from "reactstrap"

const Auction = () => {

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const productId = query.get('id');
  const [auction, setAuction]= useState({
    prodCurrentPrice: "",
    productName: "",
    auctionLive: "",
    endDateTime: "",
    soldTo: "",
    // duration: "",
    status: "",
    // startTime: ""
  })

  const [data, setInput] = useState({
    price: "",
    productId: productId ,
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
// can place bid only if the auction is live
      if(!auction.auctionLive)
      {
        alert("Cant place bid! \nAuction is not live.");
        setInput({price:""});
        return;
      }
      
// can place bid only if the price is greater than current price 
      if( price<=auction.prodCurrentPrice )
      {
        alert("Cant place bid! \nCurrent price is higher than the bid placed.");
        setInput({price:""});
        return;
      }
  
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
        window.location.reload();
    };
}

// GET request for getting the auction data
function getSpace(){
  
    fetch("http://localhost:3001/api/auctionSpace?id=" + productId , {
          headers: { "Authorization": "Bearer "+localStorage.getItem("token")}
        })
      .then(response => response.json())
      .then(data => 
        {
          setBids(data.bidsList);
          setAuction((previousState) => {
            return {
              ...auction,
              prodCurrentPrice: data.currPrice,
              productName: data.productName,
              auctionLive: data.auctionLive,
              endDateTime: data.endDateTime,
              soldTo: data.soldTo,
              // duration:data.duration,
              status: data.status,
            };
          });
          
        }
      )
      .catch(error => console.error(error));
  
}

// test()

// to auto refresh page
useEffect(() => {
  let interval
  setTimeout(function() {
    getSpace()
  
    interval = setInterval(() => {
      getSpace()
    }, 5000); // Refresh every 5 seconds

}, 1);


  return () => clearInterval(interval);
}, []);


// displaying all the bids of the current product
  const bidTable = bids.map((bid) => (
    <tr key={bid.id}>
      <td>
      <a href={`/userProfile?id=${bid.bidderId}`} > {bid.bidderName} </a>
      </td>
      <td> {bid.price} </td>
      <td> {bid.time} </td>
    </tr>
  ));

  return (
    <div>

      <NavBar/>

      <h1> Auction Space for {auction.productName} </h1>
      <div className={styles.auctionSpace}>
        <div>
        <div className={styles.container}>
        <div className={styles.element}><h6>  Current Price: {auction.prodCurrentPrice} </h6></div>
        <div className={styles.element}><h6>  Status: { auction.status} </h6></div>
        <div className={styles.element}><h6>  Auction Ends at: { auction.endDateTime } </h6></div>
        <div className={styles.element}><h6>  Sold To: { auction.soldTo? auction.soldTo: "--" } </h6></div>
        </div>
        </div>
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
