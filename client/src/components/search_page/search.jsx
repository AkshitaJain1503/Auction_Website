import React,{ useEffect,useState} from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar/index";
import { Link } from 'react-router-dom';
//import React, { Component ,useEffect} from 'react';
import './App.css';


// this function returns name that has been searched for by the user
const GetProductname = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const name = query.get('name');
    
    return name;
}
//fetches all products that match the name from GetProductname()
const GetSearchResults = () => {
    const name = GetProductname();
    const [data, setData] = React.useState([]);
    const [sort, setSort] = React.useState("none");
    const [selectedCities, setSelectedCities] =React.useState({});
   // const [Time,setTime] =React.useState("none");
    useEffect(() => {
        if(Object.keys(data).length === 0){
            const url = "http://localhost:3001/api/search?name=" + name;
            axios
                .get(url)
                .then((res) => {
                    setData(res.data.data);
                })
            }
        }, [data, name])
        const handleShipment = (e) => {
            const city = e.target.value;
            const isChecked = e.target.checked;
            setSelectedCities((prevSelectedCities) => ({
              ...prevSelectedCities,
              [city]: isChecked,
            }));
          };
        let ShipmentData = data;
        if (Object.keys(selectedCities).length > 0) {
            ShipmentData = data.filter((item) => {
              const shipmentCity = item.shipment;
              return (
                Object.prototype.hasOwnProperty.call(selectedCities, shipmentCity) &&
                selectedCities[shipmentCity]
              );
            });
          }
        const handleSort = (e) => {
            setSort(e.target.value);
        }
    
        let sortedData = ShipmentData;
        if (sort === "lowToHigh") {
            sortedData = ShipmentData.sort((a, b) => a.basePrice - b.basePrice);
        } else if (sort === "highToLow") {
            sortedData = ShipmentData.sort((a, b) => b.basePrice - a.basePrice);
        }
        else if(sort === "StartTime")
        {
            sortedData = ShipmentData.sort((a, b) => {
                const aStartTime = new Date(a.fStartTime).getTime();
                const bStartTime = new Date(b.fStartTime).getTime();
                return aStartTime - bStartTime;
        });
    }
    else if(sort === "EndTime")
        {
            sortedData = ShipmentData.sort((a, b) => {
                const aEndTime = new Date(a.fEndTime).getTime();
                const bEndTime = new Date(b.fEndTime).getTime();
                return aEndTime - bEndTime;
        });
    }
        
        
        return { data: sortedData, handleSort, handleShipment,name,setSelectedCities};
    };
    const SearchDetails = () => {
        const navigate = useNavigate();
        const { data, handleSort ,handleShipment,name,setSelectedCities} = GetSearchResults();
        if (Object.keys(data).length > 0) {

            const handleOnClickEvent = (product) => {
                navigate(`/productPage?id=${product.productId}`  );
              };

            return (
                <div>
                    <NavBar />
                    <h4>Search Results for : '{name}'</h4>
                    <h5>Total Matching Products: {data.length}</h5>

                    <div className='cont'>
  <label htmlFor="shipment-cities">Select shipment cities:</label>
  <select onChange={handleSort}>
                            <option value="none" >Sort by:</option>
                            <option value="lowToHigh">Price Low to High</option>
                            <option value="highToLow">Price High to Low</option>
                            <option value="StartTime">Start Time</option>
                            <option value="EndTime">End Time</option>
                        </select>
  <div  onChange={handleShipment}>
    <input type="checkbox" id="Hyderabad" name="shipment-cities[]" value="Hyderabad" />
    <label htmlFor="Hyderabad">Hyderabad</label>
  </div>
  <div onChange={handleShipment}>
    <input type="checkbox" id="Pune" name="shipment-cities[]" value="Pune" />
    <label htmlFor="Pune">Pune</label>
  </div >
  <div onChange={handleShipment}>
    <input type="checkbox" id="Surat" name="shipment-cities[]" value="Surat" />
    <label htmlFor="Surat">Surat</label>
  </div>
  <div onChange={handleShipment}>
    <input type="checkbox" id="houston" name="shipment-cities[]" value="Houston" />
    <label htmlFor="houston">Houston</label>
  </div>
  <div onChange={handleShipment}>
    <input type="checkbox" id="miami" name="shipment-cities[]" value="Miami" />
    <label htmlFor="miami">Miami</label>
  </div>



                        <a href={`/calendarView?name=${name}`}>
					<button className="white_btn">
						Calendar
					</button>
				</a>
                    </div>
                    <hr></hr>
                    <ul className="card-grid">
                        {data.map((data) => (
                            <li>
                                <div onClick={() => handleOnClickEvent(data)} >
                                    <article className="card" key={data.productId}>
                                    <div className="card-image">
                                        <img src={data.img} alt={data.productName} />
                                    </div>
                                    <div className="card-content">
                                        <h2 className="card-name">{data.productName}</h2>
                                        <ol className="card-list">
                                            <ul>
                                                Base Price :
                                                { <span>{ data.basePrice}</span> }
                                            </ul>
                                            <ul>
                                                Shipment From: {data.shipment}
                                            </ul>
                                            <ul>
                                                Start Time: {data.StartTime}
                                            </ul>
                                            <ul>
                                                End Time :  {data.EndTime}
                                            </ul>
                                        </ol>
                                        </div>
                                </article>
                                </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    } 
     else {
        return (
            <div>
                <NavBar />
                <h5>Sorry, No products match your search results</h5>
            </div>
        );
    }
}

export default SearchDetails;