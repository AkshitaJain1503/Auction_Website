import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "../home/card";
import styled from "styled-components";

export default function PastAuctions() {
    const [products, setProducts] = useState();
    useEffect(() => {
      const fetchdata = async () => {
        const data = await axios.get("http://localhost:3001/api/pastAuction");
        setProducts(data);
      };
      fetchdata();
    }, []);
  return (
    <div>
      <Hbar>
        <h4>Past Auctions</h4>
      </Hbar>
      <Content>
     {products &&
        products?.data.map((product) => (
          <Card
            key={product._id}
            Product={product}
          />
        ))}
      </Content>
    </div>
  )
}


const Content = styled.div`
  display: grid;
  justify-content: center;
  place-items: center;
  width: 100%;
  grid-auto-rows: 420px;
  grid-template-columns: repeat(4, 280px);
  grid-gap: 20px;
  background-color: rgb(234, 237, 237);
  }
`;
const Hbar = styled.div`
  margin-top:5px;
  outline-style:solid;
	width: 100%;
  max-width:5000px;
	height: 60px;
	background-color: #ffffff;
	display: flex;
	align-items: center;
  flex-gap:100px;
  justify-content: space-between;
`