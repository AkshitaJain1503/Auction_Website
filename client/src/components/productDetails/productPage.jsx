import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../navbar/index";
import styles from "./styles.module.css";

export default function ProductPage(props) {
  // using navigate for smooth navigation across pages
  const navigate = useNavigate();

  // used to obtain the product id sent through client url
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const id = query.get("id");

  // setting product object attributes to null initially
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productImage: "",
    shipmentFrom: "",
    basePrice: "",
    name: "",
    sellerId: "",
    aucStart: "",
    aucEnd: "",
  });

  // getProducts function call so that product details get rendered successfully on product page
  const getProducts = async () => {
    // fetching product details from backend server
    const response = await fetch(
      "http://localhost:3001/api/productDetails?id=" + id
    );

    // storing info in json format
    const res = await response.json();

    // checking if response not obtained due to user authentication issue
    if (response.status === 404 || !response) {
      window.location = "/signup";
    }

    // assigning the product details' values to the product object attributes
    setProduct((previousState) => {
      return {
        ...product,
        productName: res.data.productName,
        productDescription: res.data.productDescription,
        productImage: res.data.productImage,
        shipmentFromPlace: res.data.shipmentFromPlace,
        basePrice: res.data.productBasePrice,
        name: res.data.sellerName,
        sellerId: res.data.sellerId,
        aucStart: res.data.aucStart,
        aucEnd: res.data.aucEnd,
      };
    });
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // addToWatchList function call for adding the given product to the watchlist of the logged in user
  const addToWatchList = async () => {
    // defining headers for get request
    const myHeaders = new Headers({
      Authorization: "Bearer " + localStorage.getItem("token"),
    });

    // adding the product to the watchList array in the server side by making a GET request
    const res = await fetch(
      "http://localhost:3001/api/addToWatchList?id=" + id,
      {
        method: "GET",
        headers: myHeaders,
      }
    );

    // if response not obtained due to user authentication issue, redirect to signup page
    if (res.status === 404 || !res) {
      window.location = "/signup";
    }

    // otherwise go to watchlist page
    navigate(`/watchList`);
  };

  const handleClick = () => {
    navigate(`/auctionSpace?id=` + id);
  };
 
  const chatWithSeller = () => {
    navigate(`/chat?id=`+product.sellerId+"&name="+product.name+"&bool=t&product="+product.productName);
  }
  return (
    <>
      <NavBar />
      <div>
        <h1 className={styles.productName}>{product.productName}</h1>
        <div className={styles.classify}>
          <div className={styles.img}>
            <img
              src={product.productImage}
              className={styles.image}
              alt="product"
            />
          </div>
          <div className={styles.details}>
            <span className={styles.desc}>{product.productDescription}</span>
            <span className={styles.ship}>
              Shipment from {product.shipmentFromPlace}
            </span>
            <span> Base Price: &#x20b9; {product.basePrice}</span>
            <span>
              {" "}
              Seller :{" "}
              <a
                href={`/userProfile?id=${product.sellerId}`}
                className={styles.links}
              >
                {product.name}{" "}
              </a>
            </span>
            <span> Start Time of auction: {product.aucStart}</span>
            <span> End Time of auction: {product.aucEnd} </span>
            <div className={styles.btns}>
              <button onClick={handleClick} className={styles.button}>
                Auction Space
              </button>
              <button onClick={addToWatchList} className={styles.button}>
                Add to Watch List
              </button>
              </div>
              <div className={styles.btn}>
              <button onClick={chatWithSeller} className={styles.button}>
                Chat with Seller
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
