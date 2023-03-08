import React,{ useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TableControl } from 'react-bootstrap-table-control';
import NavBar from "../navbar/index";

//import React, { Component ,useEffect} from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';
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
    const [data, setData] = React.useState({})
    
    useEffect(() => {
        if(Object.keys(data).length === 0){
            const url = "http://localhost:3001/api/search?name=" + name;
        axios
            .get(url)
            .then((res) => {
            setData(res.data.data);
            })
        }
    })
    return data;
    //this data is an object with array of objects
    //{[{},{},{}]}
    //i chose this format as tablecontrol takes this format only
};

//Renders the past purchases in a table whose each row on cliking renders the specific product page.
//(TableControl) 25 rows are shown on one page. Rest are shown via pagination
// const SearchDetails = () => {
//     const navigate = useNavigate();
//     let data = GetSearchResults()
    
//      if(Object.keys(data).length > 0){
//         return (
//             <div>
//                 <NavBar/>
//                 <h5>Total Matching Products:  {data.length}</h5>
//                 <hr/>
//                  <TableControl
//                     header={[
//                     { key: "SNo", name: "#" },
//                     { key: "productName", name: "Product Name" },
//                     { key: "basePrice", name: "Base Price" }
//                     ]}
//                     itens={data}
//                     onClickdata={function navProduct(data){
//                         navigate(`/productPage?id=${data.productId}`);
//                     }}

//                     clickable
//                     tableProps={{
//                         hover: true,
//                     }}
//                     totalPosition="none"
//                 /> 
                
//             </div>
//         );
//     }
    const SearchDetails = () => {
        const navigate = useNavigate();
        let data = GetSearchResults()
        
         if(Object.keys(data).length > 0){
            return (
                <div>
                 <NavBar/>
                <h5>Total Matching Products:  {data.length}</h5>
                <hr/>
                
                <ul className="card-grid" onClickdata={function navProduct(data){
                         navigate(`/productPage?id=${data.productId}`);
                     }}>
                    {data.map((data) => (
                        <li>
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
                        </li>
                    ))}
                </ul>
            </div>
            
            );
    }
            
        
    else{
        return (
            <div>
              <NavBar/>
              <h5>Total Matching Products: {Object.keys(data).length}</h5>
            </div>
        );
    }
}
// const SearchDetails = () => {
//     const navigate = useNavigate();
//     let data = GetSearchResults();
//     const handleNavigate = (data) => {
//       navigate(`/productPage?id=${data.productId}`);
//     };
  
//     return (
//       <div>
//         <NavBar />
//         <h5>Total Matching Products: {data.length}</h5>
//         <hr />
//         <ReactiveList
//           componentId="productId"
//           dataField="productName"
//           react={{
//             and: ['productName'],
//           }}
//           renderdata={(data) => (
//             <div key={data.productId} onClick={() => handleNavigate(data)}>
//                 <h3>{data.productName}</h3>
//             <p>{data.SNo}</p>
//             <img src={data.img} alt={data.productName} />
//             <p>Base Price: {data.basePrice}</p>
//           </div>
//         )}
//       />
//     </div>
//   );
// };
export default SearchDetails;