import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "../home/card";
import styled from "styled-components";
import NavBar from "../navbar";
export default function ViewAll() {
    const [products, setProducts] = useState({});
    var url;
    url=window.location.pathname;
    url=url.substring(1);
    useEffect(() => {
        const fetchdata = async () => {
        const data = await axios.get("http://localhost:3001/api/"+url);
        setProducts(data);
      };
      fetchdata();
    }, []);
    url=url.charAt(0).toUpperCase()+url.slice(1);
    if(Object.keys(products).length > 0){
      return (
        <div>
          <NavBar/>
          <Hbar>
            <h4>{url.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}</h4>
          </Hbar>
          <Content>
            {products &&
              products?.data.map((product) => (
              <Card
                key={product.SNo}
                Product={product}
              />
              ))
           }
          </Content>
        </div>
      )
  }
    else{
      return(
        <div>
          <NavBar/>
          <h5>Sorry,No {url.replace(/([a-z0-9])([A-Z])/g, '$1 $2')} available right now.</h5>
        </div>
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
  h4{
    margin-left:auto;
    margin-right:auto;
    color:#334b48
  }
`
