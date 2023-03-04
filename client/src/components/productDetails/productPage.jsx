import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavLoggedIn from "../navbar/navLoggedIn";
import styles from "./styles.module.css";

export default function ProductPage(props) {
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
    firstName: "",
    lastName: ""
  });

  const getProducts = async () => {
    const response = await fetch(
      "http://localhost:3001/api/productDetails?id=" + id
    );
    const res = await response.json();
    // console.log(res.data.productName);
    setProduct((previousState) => {
      return {
        ...product,
        productName: res.data.productName,
        productDescription: res.data.productDescription,
        productImage: res.data.productImage,
        shipmentFrom: res.data.shipmentFrom,
        basePrice: res.data.productBasePrice,
        firstName: res.data.sellerFirstName,
        lastName: res.data.sellerLastName
      };
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleClick = () => {
    navigate('/auctionSpace', {state : {productId : data}});
  };

  // console.log("product name");
  // console.log(product.data.productName);
  return (
    <>
      <NavLoggedIn />
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
           <span> Seller :  <a href="./" className={styles.links}>{product.firstName} {product.lastName}</a></span>
           <span> Start Date of auction: 23.10.2003</span>
           <span> Start time of auction: 12:30 am </span>
           <span> Duration: 23 hours 2 minutes</span>
           <span> Status: Upcoming</span>
           <button onClick={handleClick} className={styles.button}>Auction Space</button>
          </div>
        </div>
      </div>
    </>
  );
}
