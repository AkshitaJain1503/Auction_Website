import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../navbar/index";
import styles from "./styles.module.css";

export default function ProductPage(props) {
  const navigate = useNavigate();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const id = query.get('id');
  console.log(id);

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

  const getProducts = async () => {
    const response = await fetch(
      "http://localhost:3001/api/productDetails?id=" + id
    );
    const res = await response.json();

    if(res.status === 404 || !res) {
      window.location = "/signup";
    }
    // console.log(res.data.productName);
    setProduct((previousState) => {
      return {
        ...product,
        productName: res.data.productName,
        productDescription: res.data.productDescription,
        productImage: res.data.productImage,
        shipmentFrom: res.data.shipmentFrom,
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
  }, []);

  const addToWatchList = async () => {
    const myHeaders = new Headers({
      Authorization: "Bearer " + localStorage.getItem("token"),
    });
    const res = await fetch("http://localhost:3001/api/carts?id=" + id, {
      method: "GET",
      headers: myHeaders,
    });

    if(res.status === 404 || !res) {
      window.location = "/signup";
    }

    navigate(`/AllProductCarts`);
  };

  const handleClick = () => {
    navigate(`/auctionSpace?id=`+ id);
  };

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
              Shipment from {product.shipmentFrom}
            </span>
            <span> Base Price: {product.basePrice}</span>
           <span> Seller : <a href={`/userProfile?id=${product.sellerId}`} className={styles.links}>{product.name} </a></span>
           <span> Start Time of auction: {product.aucStart}</span>
           <span> End Time of auction: {product.aucEnd} </span>
           <div className={styles.btns}>
              <button onClick={handleClick} className={styles.button}>Auction Space</button>
              <button onClick={addToWatchList} className={styles.button}>Add to Watch List</button>
           </div>
          </div>
        </div>
      </div>
    </>
  );
}
