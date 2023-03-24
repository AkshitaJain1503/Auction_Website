import React from "react";
import { useNavigate } from "react-router-dom";

const Items = ({
  auction_id,
  product_id,
  productImage,
  productName,
  currentPrice,
  auctionStartDateTime,
  auctionEndDateTime,
  auctionStatus,
  dayDifference,
  minutesDifference,
  hourDifference
}) => {
  // navigate is used for smooth navigation to product page or auction space when required by onclick
  const navigate = useNavigate();

  // removeItem function called for removing a particular item from the watchlist products
  const removeItem = async () => {
    // defining header of the get request
    const myHeaders = new Headers({
      Authorization: "Bearer " + localStorage.getItem("token"),
    });

    // sending get request to the backend server for removing the item
    const response = await fetch(
      "http://localhost:3001/api/removeItem?item=" + auction_id,
      {
        method: "GET",
        headers: myHeaders,
      }
    );

    // if response obtained, reload the page for getting the current result
    if (response) {
      window.location.reload(false);
    }

    // if response not obtained, move to signup page for user log in
    if (response.status === 404 || !response) {
      window.location = "/signup";
    }
  };

  // go to the auction space of that particular product on click
  const goToAuctionSpace = () => {
    navigate(`/auctionSpace?id=${product_id}`);
  };

  // go to the product page of that particular product on click
  const goToProductPage = () => {
    navigate(`/productPage?id=${product_id}`);
  };
  return (
    <>
      <div className="items-info">
        <div
          style={{
            backgroundColor:
              auctionStatus === "Live Auction"
                ? "green"
                : auctionStatus === "Past Auction"
                ? "grey"
                : "purple",
            height: "30px",
            marginTop: "40px",
            padding: "15px",
            borderRadius: "15px",
            color: "white",
            paddingTop: "2px",
            width: "180px",
            textAlign: "center"
          }}
        >
          {auctionStatus}
        </div>
        <div className="product-img">
          <img src={productImage} alt="arrow" onClick={goToProductPage}></img>
        </div>
        <div className="title">{productName}</div>
        <div className="price">
         { auctionStatus === "Upcoming Auction" && <p>Starts in {dayDifference} days, {hourDifference} hours, {minutesDifference} minutes </p>}
          <p>Current Price: &#x20b9; {currentPrice} </p>
          <p>Start Time: {auctionStartDateTime}</p>
          <p>End Time: {auctionEndDateTime}</p>
        </div>
        <div className="price">
          <button className="watch-btn" onClick={goToAuctionSpace}>
            Watch
          </button>
        </div>
        <div className="remove-item">
          <i
            className="fas fa-trash-alt add remove"
            onClick={() => removeItem()}
          ></i>
        </div>
      </div>
      <hr />
    </>
  );
};

export default Items;
