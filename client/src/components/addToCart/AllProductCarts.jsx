import React, { useEffect, useState } from "react";
import "./cart.css";
import Items from "./items";
import { Scrollbars } from "react-custom-scrollbars-2";

const AllProductCarts = () => {
  const [item, setItem] = useState([]);

  const getItems = async () => {
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    });
    const response = await fetch("http://localhost:3001/api/AllProductCarts", {
      method: "GET",
      headers: myHeaders,
    });
    const res = await response.json();
    if(res.status === 404 || !res) {
      window.location = "/signup";
    }
    setItem(res.data);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      <header>
        <div className="continue-shopping">
          <a href="/">
            <img src="./arrow.png" alt="arrow" className="arrow-icon" />
          </a>
          <h3>Look for other items</h3>
        </div>
        <div className="cart-icon">
          <img src="./cart.png" alt="cart" />
          <p>{item.length}</p>
        </div>
      </header>
      <section className="main-cart-section">
        <h1>WatchList</h1>
        <p className="total-items">
          You have <span className="total-items-count">{item.length}</span>{" "}
          items in WatchList
        </p>
        <div className="cart-items">
          <div className="cart-items-container">
            <Scrollbars>
              {item.map((currItem) => {
                return <Items key={currItem.product_id} {...currItem} />;
              })}
            </Scrollbars>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProductCarts;
