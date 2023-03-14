import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../navbar/index";
import styles from "./styles.module.css";
import {Form, Button} from "reactstrap"
import AuctionTimer from "./timer";

const Auction = () => {

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const productId = query.get('id');
  const [auction, setAuction]= useState({
    prodCurrentPrice: "",
    productName: "",
    auctionLive: "",
    endDateTime: "",
    startDateTime: "",
    soldTo: "",
    auctionEnded: "",
    seller : "",
    status: "",
    loggedInUser: "",
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
// cant place bid if the bidder is same as seller
      // if(auction.seller==auction.loggedInUser)
      // {
      //   alert("You cant place bid on your own product!");
      //   setInput({price:""});
      //   return;
      // }
      
// can place bid only if the price is greater than current price 
      // if( price<=auction.prodCurrentPrice )
      // {
      //   alert("Cant place bid! \nCurrent price is higher than the bid placed.");
      //   setInput({price:""});
      //   return;
      // }
  
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

// GET request -- when page reloads
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
              auctionLive: data.auctionLive,
              endDateTime: data.endDateTime,
              startDateTime: data.startDateTime,
              soldTo: data.soldTo,
              auctionEnded: data.auctionEnded,
              status: data.status,
              seller: data.seller,
              loggedInUser: data.loggedInUser,
            };
          });
          
        }
      )
      .catch(error => console.error(error));
 },[])

// GET request for updating bidding data
async function getSpace(){
  
    await fetch("http://localhost:3001/api/auctionSpace/onlyAuction?id=" + productId , {
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
              auctionLive: data.auctionLive,
              soldTo: data.soldTo,
              auctionEnded: data.auctionEnded,
              status: data.status,
            };
          });
          
        }
      )
      .catch(error => console.error(error));
  
}

// to auto refresh page
useEffect(() => {
  let interval
  
    interval = setInterval(() => {
      getSpace()
      // stops refreshing once the auction has ended
      if(auction.auctionEnded)
      {
        clearInterval(interval);
      }
    }, 5000); // Refresh every 5 seconds


  return () => clearInterval(interval);
}, [auction.auctionEnded]);


// displaying all the bids of the current product
  const bidTable = bids.map((bid) => (
    <tr key={bid._id}>
      <td>
      <a href={`/userProfile?id=${bid.bidder}`} > {bid.bidderName} </a>
      </td>
      <td> {bid.price} </td>
      <td> {bid.time} </td>
    </tr>
  ));

  return (
    <div>

      <NavBar/>

      <h1> Auction Space for <a className={styles.link} href={`/productPage?id=${productId}`} > {auction.productName} </a>  </h1>
      <div className={styles.backGroundSpace}>
        <div>
        <div className={styles.container}>
        <div className={styles.element}><h6>  Current Price: {auction.prodCurrentPrice} </h6></div>
        <div className={styles.element}><h6>  Status: { auction.status} </h6></div>
        <div className={styles.element}><h6>  Sold To: { auction.soldTo? auction.soldTo: "--" } </h6></div>
        </div>
        </div>
        <div>
        <div className={styles.container}>
        <div className={styles.element}><h6>  Auction Start Time: { auction.startDateTime } </h6></div>
        <div className={styles.element}><h6>  { auction.auctionLive ? <AuctionTimer productId={productId} /> : "--" } </h6></div>
        
        <div className={styles.element}><h6>  Auction End Time: { auction.endDateTime } </h6></div>
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
