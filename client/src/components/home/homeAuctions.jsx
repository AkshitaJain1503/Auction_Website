import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./card";
import styled from "styled-components";
export default function HomeAuctions({str}) {
    const [products, setProducts] = useState({});
    useEffect(() => {
      const fetchdata = async () => {
        const data = await axios.get("http://localhost:3001/api/home"+str);
        setProducts(data);
      };
      fetchdata();
    }, []);
    if(Object.keys(products).length > 0){
        return (
            <Content>
                {products &&
                products?.data.map((product) => (
                    <Card
                        key={product.SNo}
                        Product={product}
                    />
                ))}
            </Content>
         )
    }
    else{
        return(
            <h5>Sorry,No auctions available right now.</h5>
        )
    }
}


const Content = styled.div`
  display: grid;
  justify-content: center;
  place-items: center;
  width: 100%;
  grid-auto-rows: 420px;
  grid-template-columns: repeat(4, 280px);
  grid-gap: 20px;
`;