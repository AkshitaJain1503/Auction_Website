import React, { useEffect, useState } from "react";
import "./style.css";
import NavBar from "../navbar/index";
import Items from "./items";
import { Scrollbars } from "react-custom-scrollbars-2";

const WatchList = () => {
  // setting the item array as null initially and using useState for changing its value later
  const [item, setItem] = useState([]);

  // obtaining all product items of the watchlist from the backend server
  const getItems = async () => {
    // setting headers
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    });

    // obtaining response from get request
    const response = await fetch("http://localhost:3001/api/watchList", {
      method: "GET",
      headers: myHeaders,
    });

    // obtaining json data from response
    const res = await response.json();

    // if response not obtained, go to signup page
    if (response.status === 404 || !response) {
      window.location = "/signup";
    }

    // setting the item array as the json data obtained from backend server (item contains all the product details of watchlist products)
    setItem(res.data);
  };

  // useEffect used for getting the watchlist products on first render only
  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
         <NavBar/>
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

export default WatchList;
