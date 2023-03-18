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
    const navigate = useNavigate();
    const name = GetProductname();
    const [data, setData] = useState([]);
    const [sort, setSort] = useState("none");
    const [showLive, setShowLive] = useState(true);
    const [showUpcoming, setShowUpcoming] = useState(true);
    const [showEnded, setShowEnded] = useState(false);
    const [statusList, setstatusList] = useState(["Present","Future"]);
    //const history = useHistory();
    useEffect(() => {
        const fetchdata = async () => {
            const url = `http://localhost:3001/api/search?name=${name}`;
            const tokenStr = localStorage.getItem("token");
            const headers = { "Authorization": "Bearer "+tokenStr };
            const response = await axios.get(url, { headers });
            setData(response.data);
        };
            fetchdata();
        }, [ name])

        
        let LoggedIn= false;
        //console.log(data);
        //console.log(typeof(data));
        if(data.length>0 && data[0].userLoggedIn=== true)
    {
        LoggedIn = true;
    }
    //console.log(LoggedIn);
        const handleShowLiveChange = (event) => {
            const checked = event.target.checked;
            setShowLive(checked);
        
            if (checked) {
              setstatusList([...statusList, "Present"]);
            } else {
              setstatusList(statusList.filter(status => status !== "Present"));
            }
          };
        
          const handleShowUpcomingChange = (event) => {
            const checked = event.target.checked;
            setShowUpcoming(checked);
            if (checked) {
                setstatusList([...statusList, "Future"]);
            } else {
              setstatusList(statusList.filter(status => status !== "Future"));
            }
          };

          const handleShowEndedChange = (event) => {
            const checked = event.target.checked;
            setShowEnded(checked);
            if (checked) {
                setstatusList([...statusList, "Past"]);
            } else {
              setstatusList(statusList.filter(status => status !== "Past"));
            }
          };
        const handleSort = (e) => {
            const selectedSort = e.target.value;

    if (selectedSort === "Distance" && LoggedIn === false) {
        alert("You need to be logged in to sort by shipment Distance!");
        navigate(`/login`);
        return;
    }

            setSort(e.target.value);
        }
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
    else if(sort === "Distance")
    {
        sortedData = data.sort((a, b) => a.dist - b.dist);
    }
        return { data: sortedData, handleSort,name,handleShowEndedChange,handleShowLiveChange,handleShowUpcomingChange,statusList};
    };

    




     const SearchDetails = () => {
        const navigate = useNavigate();
    const { data:products, handleSort ,name,handleShowEndedChange,handleShowLiveChange,handleShowUpcomingChange,statusList} = GetSearchResults();
    
   // console.log('products', products);
  if (products.length > 0) {
        // const handleOnClickEvent = (product) => {
        //     navigate(`/productPage?id=${product.productId}`  );
        //   };
       
    
            return (
                                <div >
                                    <NavBar />
                                    <h1>Search Results for : '{name}'</h1>
                                    {/* <h5>Total Matching data: {products.length}</h5> */}
                
                                    <div className='cont'>
                    <select onChange={handleSort}>
                                            <option value="none" >Sort by:</option>
                                            <option value="lowToHigh">Price Low to High</option>
                                            <option value="highToLow">Price High to Low</option>
                                            <option value="StartTime">Start Time</option>
                                            <option value="EndTime">End Time</option>
                                            <option value="Distance">Distance</option>
                                        </select>
                                        <a href={`/calendarView?name=${name}`}>
                					<button className="white_btn">
                						Calendar
                					</button>
                				</a>
                                <label>
                                    <input
                                    type="checkbox"
                                    //checked={showEnded}
                                    onChange={handleShowEndedChange}
                                    />
                                    Show ended     
                                </label>
                                <label>
                                    <input
                                    type="checkbox"
                                    //checked='true'
                                    defaultChecked={true} 
                                    onChange={handleShowLiveChange}
                                    />
                                    Show live    
                                </label>
                                <label>
                                    <input
                                    type="checkbox"
                                    //checked={showUpcoming}
                                    //checked='true'
                                    defaultChecked={true} 
                                    onChange={handleShowUpcomingChange}
                                    />
                                    Show upcoming  {" "}  
                                </label>
                                </div>
                                <div>
                                
                               
                                </div>
            <Content >
                {products.filter((product) => statusList.includes(product.status)).map((product) => (
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
            <div>
            <   NavBar />
            <h5>Sorry,No matching products.</h5>
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
 
  
 background-color: rgb(220, 218, 218);
 
  }
`;
export default SearchDetails;