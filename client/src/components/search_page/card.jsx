import React from "react";
import styled from "styled-components";
const Card = ({Product}) => {
  const addToWatchList = (e) => {
  };
 
  var title=Product.productName;
  var price=Product.productBasePrice;
  var id=Product._id;
  var image=Product.productImage;
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
        <p>Base Price ₹ {price}</p>
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
    width: 180px;
    height: 200px;
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
    font-size: 16px;
    font-weight: 600;
  }
  p {
    font-weight: 600;
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