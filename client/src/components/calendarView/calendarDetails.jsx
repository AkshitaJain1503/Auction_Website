import React,{ useEffect,useState} from 'react';
import { useLocation } from "react-router-dom";
import NavBar from "../navbar/index";
import moment from 'moment';
import Card from "../home/card";
import styled from "styled-components";

 const CalendarDetails = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const productName = query.get('name');
    const date = query.get('date');
    const formattedDate = moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/api/calendarDetails?name=${productName}&date=${date}` )
          .then(response => response.json())
          .then(data => 
            {
              setData(data.data);             
            }
          )
          .catch(error => console.error(error));
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return (
        <Container>
            <NavBar />
             <div>
             <h1>Search results for "{productName}" on {formattedDate}</h1>
                 <h5 style={{paddingLeft: "10px"}}>Total Matching Products: {data.length}</h5> 
            </div>
            <hr />
            <Content>
                {data.map((product) => (
                    <Card key={product.productId} Product={product} />       
                ))}
            </Content>
    </Container>
);
} 

const Content = styled.div`
  display: grid;
  justify-content: center;
  place-items: center;
  width: 100%;
  grid-auto-rows: 420px;
  grid-template-columns: repeat(4, 280px);
  grid-gap: 20px;
  background-color: rgba(147, 147, 147, 0.3);\
  padding-bottom: 100px;
`;

const Container = styled.div`
  width: 100%;
  height:100vh;
  margin: auto;
  height: fit-content;
  align:block;
`;

export default CalendarDetails;
