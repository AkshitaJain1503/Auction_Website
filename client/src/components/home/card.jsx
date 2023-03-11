import React from "react";
import styled from "styled-components";
const Card = ({Product}) => {
  const addToWatchList = (e) => {
   
  };
  var shipmentFrom=Product.shipment;
  var title=Product.productName;
  var price=Product.basePrice;
  var id=Product.productId;
  var image=Product.img;
  var endTime=Product.EndTime;
  var startTime=Product.StartTime;
  const viewPage = () => {
    window.location.href="/productPage?id="+id;
  }
  return (
    <Container onClick={viewPage}>
      <Image>
        <img src={image} alt="" />
      </Image>
      <Description>
        <h5>{title}</h5>
        <h6>Base Price  ₹{price}</h6>
        <p>Shipment From {shipmentFrom}</p>
        <p>Begins on        : {startTime}</p>
        <p>Concludes on  : {endTime}</p>
        <button onClick={addToWatchList}>Add to Watch List</button>
      </Description>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  z-index: 10;
  margin-top:50px;
`;
const Image = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex: 0.3;
  img {
    width: 160px;
    height: 180px;
  }
`;
const Description = styled.div`
  width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 0.7;
  h5 {
    font-size: 19px;
    font-weight: 600;
  }
  h6{
    color: #00332d;
    font-size: 17px;
    font-weight: 500;
  }
  p {
    font-size: 16px;
    font-weight: 600;
    white-space: pre;
    color:#545479;
  }
  button {
    width: 100%;
    height: 33px;
    background-color: #ccf67f;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
`;
export default Card;
