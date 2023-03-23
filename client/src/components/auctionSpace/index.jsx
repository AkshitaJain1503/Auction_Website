import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../navbar/index";
import styles from "./styles.module.css";
import {Form, Button} from "reactstrap"
import AuctionTimer from "./timer";
import axios from 'axios';

const Auction = () => {

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const productId = query.get('id');
  const [auction, setAuction]= useState({
    prodCurrentPrice: "",
    prodBasePrice: "",
    productName: "",
    auctionLive: "",
    endDateTime: "",
    startDateTime: "",
    soldTo: "",
    auctionEnded: "",
    seller : "",
    auctionStatus: "",
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
// cant place bid if its less than the base price
      if(price < auction.prodBasePrice)
      {
        alert("Cant place bid! \nThe minimum allowed price is the base price.");
        setInput({price:""});
        window.location.reload();
        return;
      }
// cant place bid if the bidder is same as seller
      // if(auction.seller==auction.loggedInUser)
      // {
      //   alert("You cant place bid on your own product!");
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
useEffect( () => {
  
      const url = "http://localhost:3001/api/auctionSpace?id=" + productId ;
      const tokenStr = localStorage.getItem("token");
      const headers = { "Authorization": "Bearer "+tokenStr };
      axios
        .get(url, { headers })
        .then((res) => {
          if (res.status === 404 || !res) {
            window.location = "/signup";
          }
          setBids(res.data.responseData.bidsList);
          setAuction((previousState) => {
            return {
              ...auction,
              prodCurrentPrice: res.data.responseData.currPrice,
              prodBasePrice: res.data.responseData.basePrice,
              productName: res.data.responseData.productName,
              auctionLive: res.data.responseData.auctionLive,
              endDateTime: res.data.responseData.endDateTime,
              startDateTime: res.data.responseData.startDateTime,
              soldTo: res.data.responseData.soldTo,
              auctionEnded: res.data.responseData.auctionEnded,
              auctionStatus: res.data.responseData.auctionStatus,
              seller: res.data.responseData.seller,
              loggedInUser: res.data.responseData.loggedInUser,
            };
          });
        })
 },[])

// GET request for updating bidding data
async function getSpace(){

  const url = "http://localhost:3001/api/auctionSpace/onlyAuction?id=" + productId;
      const tokenStr = localStorage.getItem("token");
      const headers = { "Authorization": "Bearer "+tokenStr };
      axios
        .get(url, { headers })
        .then((res) => {
          if (res.status === 404 || !res) {
            window.location = "/signup";
          }
          setBids(res.data.responseData.bidsList);
          setAuction((previousState) => {
                    return {
                      ...auction,
                      prodCurrentPrice: res.data.responseData.currPrice,
                      auctionLive: res.data.responseData.auctionLive,
                      soldTo: res.data.responseData.soldTo,
                      auctionEnded: res.data.responseData.auctionEnded,
                      auctionStatus: res.data.responseData.auctionStatus,
                    };
                  });
        })
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


const [viewAll,setViewAll]=useState(false)
function changeClick(e){
  setViewAll(!viewAll);
}

const DisplayRow = ({ bid }) => {
  return (<tr key={bid._id}>
      <td>
      <a href={`/userProfile?id=${bid.bidder}`} > {bid.bidderName} </a>
      </td>
      <td> &#x20B9; {bid.price} </td>
      <td> {bid.time} </td>

    </tr>);
}

// displaying all the bids of the current product
  const bidTable = viewAll? bids.map((bid) => (
    <DisplayRow bid={bid}/>
        ))
    : bids.slice(0,5).map((bid) => (
      <DisplayRow bid={bid}/>
  ));

  return (
    <div>

      <NavBar/>

      <h1> Auction Space for <a className={styles.link} href={`/productPage?id=${productId}`} > {auction.productName} </a>  </h1>
      <div className={styles.backGroundSpace}>
        <div>
        <div className={styles.container}>
        <div className={styles.element}><h6>  Current max price: &#x20B9; {auction.prodCurrentPrice} </h6></div>
        <div className={styles.element}><h6>  Base Price: &#x20B9; {auction.prodBasePrice} </h6></div>
        <div className={styles.element}><h6>  Status: { auction.auctionStatus} </h6></div>
        <div className={styles.element}><h6>  Sold To: { auction.soldTo? auction.soldTo: "--" } </h6></div>
        </div>
        </div>
        <div>
        <div className={styles.container}>
        <div className={styles.element}><h6>  Auction Start Time: { auction.startDateTime } </h6></div>
        <div className={styles.element}><h6> {auction.auctionLive ? <AuctionTimer productId={productId} /> : "--" } </h6></div>
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
            <button className="btn btn-primary bid-btn" onClick={changeClick}>{viewAll?"View Less": "View More"}</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Auction;
