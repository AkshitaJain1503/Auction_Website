import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./card";
import styled from "styled-components";

export default function HomePastAuctions() {
    const [products, setProducts] = useState();
    useEffect(() => {
      const fetchdata = async () => {
        const data = await axios.get("http://localhost:3001/api/homePastAuction");
        setProducts(data);
      };
      fetchdata();
    }, []);
  return (
    <Content>
    {products &&
        products?.data.map((product) => (
          <Card
            key={product.productId}
            Product={product}
          />
        ))}
        </Content>
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
  }
`;