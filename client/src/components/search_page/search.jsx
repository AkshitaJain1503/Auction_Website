import React,{ useEffect,useState} from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar/index";
import { Link } from 'react-router-dom';
//import React, { Component ,useEffect} from 'react';
import './App.css';
import Card from "./card";
import styled from "styled-components";


// this function returns name that has been searched for by the user
const GetProductname = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const name = query.get('name');
    
    return name;
}
//fetches all data that match the name from GetProductname()
const GetSearchResults = () => {
    const name = GetProductname();
    const [data, setData] = useState([]);
    const [sort, setSort] = useState("none");
    useEffect(() => {
        const fetchdata = async () => {
            const url = `http://localhost:3001/api/search?name=${name}`;
            const response = await axios.get(url);
            setData(response.data);
        };
            fetchdata();
        }, [ name])
        const handleSort = (e) => {
            setSort(e.target.value);
        }
        console.log(typeof(data));
        console.log("hello");
        console.log(data);
        let sortedData = data;
        if (sort === "lowToHigh") {
            sortedData = data.sort((a, b) => a.basePrice - b.basePrice);
        } else if (sort === "highToLow") {
            sortedData = data.sort((a, b) => b.basePrice - a.basePrice);
        }
        else if(sort === "StartTime")
        {
            sortedData = data.sort((a, b) => {
                const aStartTime = new Date(a.fStartTime).getTime();
                const bStartTime = new Date(b.fStartTime).getTime();
                return aStartTime - bStartTime;
        });
    }
    else if(sort === "EndTime")
        {
            sortedData = data.sort((a, b) => {
                const aEndTime = new Date(a.fEndTime).getTime();
                const bEndTime = new Date(b.fEndTime).getTime();
                return aEndTime - bEndTime;
        });
    }
        return { data: sortedData, handleSort,name};
    };

    
     const SearchDetails = () => {
        const navigate = useNavigate();
    const { data:products, handleSort ,name} = GetSearchResults();
    
    console.log('products', products);
  if (products.length > 0) {
        const handleOnClickEvent = (product) => {
            navigate(`/productPage?id=${product.productId}`  );
          };

            return (
                                <div >
                                    <NavBar />
                                    <h4>Search Results for : '{name}'</h4>
                                    <h5>Total Matching data: {products.length}</h5>
                
                                    <div className='cont'>
                    <select onChange={handleSort}>
                                            <option value="none" >Sort by:</option>
                                            <option value="lowToHigh">Price Low to High</option>
                                            <option value="highToLow">Price High to Low</option>
                                            <option value="StartTime">Start Time</option>
                                            <option value="EndTime">End Time</option>
                                            {/* <option value="Distance">Distance</option> */}
                                        </select>
                                        <a href={`/calendarView?name=${name}`}>
                					<button className="white_btn">
                						Calendar
                					</button>
                				</a>
                                </div>
                        
            <Content >
                {products.map((product) => (
                    <Card
                        key={product.SNo}
                        Product={product}
                    />
                ))}
            </Content>
            </div>
         );
    }
    else{
        return(
            <h5>Sorry,No matching products.</h5>
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
 
  
 background-color: rgb(220, 218, 218);
 
  }
`;
export default SearchDetails;