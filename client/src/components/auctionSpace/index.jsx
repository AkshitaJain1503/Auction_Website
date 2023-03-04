import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../navbar/index";
import styles from "./styles.module.css";
import {Form, Button} from "reactstrap"

const Auction = () => {

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const productId = query.get('id');
  // const [startTime, setStartTime]= useState({});
  const [auction, setAuction]= useState({
    prodCurrentPrice: "",
    productName: "",
    isLive: "",
    duration: "",
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
      // if(!auction.isLive)
      // {
      //   alert("Cant place bid! \nAuction is not live.");
      //   setInput({price:""});
      //   return;
      // }
      
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
useEffect(() => {
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
            isLive: data.isLive,
            duration:data.duration,
            status: data.status,
          };
        });
        
      }
    )
    .catch(error => console.error(error));
}, []);

// to auto refresh page
useEffect(() => {
  const interval = setInterval(() => {
    window.location.reload();
  }, 10000); // Refresh every 10 seconds

  return () => clearInterval(interval);
}, []);


// console.log(startTime,"stttt");
// // to set start time
// useEffect(() => {
//   const currentDate = new Date();
//   const targetDate = new Date(startTime);
//   console.log(targetDate);
//   console.log("starttime", startTime, "e");

//   const timeUntilTarget = targetDate.getTime() - currentDate.getTime();
//   if (timeUntilTarget > 0) {
//     const timeoutId = setTimeout(() => {
//       console.log("Performing operation at target time...");
//       alert("Auction Started");
      
//       // Perform your operation here
//     }, timeUntilTarget);

//     return () => clearTimeout(timeoutId);
//   }
// }, []);

// displaying all the bids of the current product
  const bidTable = bids.map((bid) => (
    <tr key={bid.id}>
      <td>
        <a href="/"> {bid.bidderName} </a>
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
        <div className={styles.element}><h6>  Duration left: { auction.isLive? auction.duration : "--:--" } </h6></div>
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
