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
// const GetSearchResults = () => {
//     const name = GetProductname();
//     const [data, setData] = React.useState([])
//     useEffect(() => {
//         if(Object.keys(data).length === 0){
//             const url = "http://localhost:3001/api/search?name=" + name;
//         axios
//             .get(url)
//             .then((res) => {

//                 console.log("res.data.data", res.data.data);
//                 console.log("type of res.data.data", typeof(res.data.data));
//             setData(res.data.data);
//             })
//         }
//     })
//     // useEffect(() => {
//     // console.log("typeof(data)",typeof(data));
    
//     // console.log("data[0]",data); },[data])
//      return data;
//     //this data is an object with array of objects
//     //{[{},{},{}]}
//     //i chose this format as tablecontrol takes this format only
// };

// const SearchDetails = () => {
//     const navigate = useNavigate();
//     let data = GetSearchResults();
    
//      if(Object.keys(data).length > 0){
//         return (
//             <div>
//              <NavBar/>
//             <h5>Total Matching Products:  {data.length}</h5>
//             <hr/>
            
//             <ul className="card-grid" >
//                 {data.map((data) => (
//                     <li>
//                         <Link to={`/productPage?id=${data.productId}`} className="card-link">
//                         <article className="card" key={data.productId}>
//                             <div className="card-image">
//                                 <img src={data.img} alt={data.productName} />
//                             </div>
//                             <div className="card-content">
//                                 <h2 className="card-name">{data.productName}</h2>
//                                 <ol className="card-list">
//                                     <ul>
//                                     Base Price : 
//                                         { <span>{ data.basePrice}</span> }
//                                     </ul>
//                                     <ul>
//                                     Shipment From: {data.shipment}
//                                     </ul>
//                                     <ul>
//                                     Start Time: {data.StartTime}
//                                     </ul>
//                                     <ul>
//                                     End Time: {data.EndTime}
//                                     </ul>
//                                 </ol>
//                             </div>
//                         </article>
//                         </Link>  
//                     </li>
//                 ))}
//             </ul>
//         </div>
        
//         );
// }
//     else{
//         return (
//             <div>
//               <NavBar/>
//               <h5>Total Matching Products: {Object.keys(data).length}</h5>
//             </div>
//         );
//     }
// }

const GetSearchResults = () => {
    const name = GetProductname();
    const [data, setData] = React.useState([]);
    const [sort, setSort] = React.useState("none");

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
    
        const handleSort = (e) => {
            setSort(e.target.value);
        }
    
        let sortedData = data;
        if (sort === "lowToHigh") {
            sortedData = data.sort((a, b) => a.basePrice - b.basePrice);
        } else if (sort === "highToLow") {
            sortedData = data.sort((a, b) => b.basePrice - a.basePrice);
        }
    
        return { data: sortedData, handleSort };
    };
// const GetSearchResults = () => {
//     const name = GetProductname();
//     const [data, setData] = useState([]);
//     const [filter, setFilter] = useState("");

//     useEffect(() => {
//         if(Object.keys(data).length === 0){
//             const url = `http://localhost:3001/api/search?name=${name}${filter ? `&shipment=${filter}` : ""}`;
//             axios
//                 .get(url)
//                 .then((res) => {
//                     setData(res.data.data);
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });
//         }
//     }, [data, filter, name]);

//     const handleFilter = (event) => {
//         setFilter(event.target.value);
//     };
//     return [data, handleFilter];
// };

    const SearchDetails = () => {
        const navigate = useNavigate();
        const { data, handleSort } = GetSearchResults();
        if (Object.keys(data).length > 0) {
            return (
                <div>
                    <NavBar />
                    <div>
                        <h5>Total Matching Products: {data.length}</h5>
                        <select onChange={handleSort}>
                            <option value="none">Sort by Base Price</option>
                            <option value="lowToHigh">Low to High</option>
                            <option value="highToLow">High to Low</option>
                        </select>
                    </div>
                    <hr />
                    <ul className="card-grid">
                        {data.map((data) => (
                            <li>
                                <Link to={`/productPage?id=${data.productId}`} className="card-link">
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
                                                End Time: {data.EndTime}
                                            </ul>
                                        </ol>
                                        </div>
                                </article>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    } 
}
//     const SearchDetails = () => {
//         const navigate = useNavigate();
//         const [data, handleFilter] = GetSearchResults();
    
//         if (Object.keys(data).length > 0) {
//             return (
//                 <div>
//                     <NavBar/>
//                     <div className="filters">
//                         <select onChange={handleFilter} defaultValue="">
//                             <option value="" disabled hidden>Select a shipment location</option>
//                             <option value="City1">City1</option>
//                             <option value="City2">City2</option>
//                             <option value="City3">City3</option>
//                             <option value="City4">City4</option>
//                             <option value="City5">City5</option>
//                             <option value="City6">City6</option>
//                             <option value="City7">City7</option>
//                             <option value="City8">City8</option>
//                         </select>
//                     </div>
//                     <h5>Total Matching Products: {data.length}</h5>
//                 <hr/>
//                 <ul className="card-grid">
//                     {data.map((product) => (
//                         <li key={product.productId}>
//                             <Link to={`/productPage?id=${product.productId}`} className="card-link">
//                                 <article className="card">
//                                     <div className="card-image">
//                                         <img src={product.img} alt={product.productName} />
//                                     </div>
//                                     <div className="card-content">
//                                         <h2 className="card-name">{product.productName}</h2>
//                                         <ol className="card-list">
//                                             <ul>
//                                                 Base Price: {product.basePrice}
//                                             </ul>
//                                             <ul>
//                                                 Shipment From: {product.shipment}
//                                                 </ul>
//                                             <ul>
//                                                 Start Time: {product.StartTime}
//                                             </ul>
//                                             <ul>
//                                                 End Time: {product.EndTime}
//                                             </ul>
//                                         </ol>
//                                     </div>
//                                 </article>
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         );
//                     }
//     else {
//         return (
//             <div>
//                 <NavBar />
//                 <h5>Total Matching Products: {Object.keys(data).length}</h5>
//             </div>
//         );
//     }
// }

    
export default SearchDetails;